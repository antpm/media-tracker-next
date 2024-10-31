'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import ModalWrapper from '../components/modal-wrapper';
import { auth, generateImageName, addDocument, editDocument, storage } from '../util/firebase/firebase-app';
import { getDocuments } from '../util/firebase/firebase-app';
import { QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import ListCard from './list-card';
import DatePicker from 'react-datepicker';
import RatingSelect from '../components/rating-select';
import { CloseIcon, SaveIcon, AddIcon, DateIcon, Star } from '@/public/icons/icons';

/* 
    To add a new type of media to the app:
        -add useState for unique fields for the new media type
        -add checks to validation method for new unique fields
        -add a case to the save function to define the docData
        -add lines to clear new unique fields in clearForm function
        -add lines to set new unique fields in enableEditing function
        -add case to show new unique fields in showUniqueFormFields function

*/

export default function MediaList({ media }: { media: string }) {
	const [addModal, setAddModal] = useState(false);
	const [viewModal, setViewModal] = useState(false);

	const [saveMode, setSaveMode] = useState<string>('');

	const [docList, setDocList] = useState<QueryDocumentSnapshot[]>();
	const [waiting, setWaiting] = useState(true);
	const [listMode, setListMode] = useState('complete');

	const [errors, setErrors] = useState(false);
	const [errorsMsg, setErrorMsg] = useState('');
	const [oldImageName, setOldImageName] = useState('');
	const [editID, setEditID] = useState('');

	//common fields
	const [title, setTitle] = useState('');
	const [genre, setGenre] = useState('');
	const [rating, setRating] = useState(1);
	const [complete, SetComplete] = useState(new Date());
	const [image, setImage] = useState<File | null>(null);
	//in order to get the file input to reset when the modal closes, it is assigned a key which gets changed on close, causing it to be re-rendered
	const [imageKey, setImageKey] = useState(Date());
	const [select, setSelect] = useState<string>('2024');
	const [openSelect, setOpenSelect] = useState<boolean>(false);

	//game fields
	const [platform, setPlatform] = useState('');
	const [developer, setDeveloper] = useState('');

	//book fields
	const [author, setAuthor] = useState('');

	//movie fields
	const [director, setDirector] = useState('');
	const [starring, setStarring] = useState('');

	const [viewDoc, setViewDoc] = useState<QueryDocumentSnapshot | null>(null);
	const [viewDocImage, setViewDocImage] = useState('');

	const dateFormat = new Intl.DateTimeFormat('en-US', {
		month: 'long',
		day: '2-digit',
		year: 'numeric',
	});

	useEffect(() => {
		getData();
	}, []);

	function sortList(mode: Number) {
		//data from current array must be copied into a new array to trigger re-render when setting state with sorted array
		setWaiting(true);
		const old = [...docList!];
		switch (mode) {
			case 1:
				const sortCompleted = old.sort((a, b) => (a.get('complete') <= b.get('complete') ? 1 : -1));
				setDocList(sortCompleted);
				setListMode('complete');
				setWaiting(false);
				break;
			case 2:
				const sortRating = old.sort((a, b) => (a.get('rating') <= b.get('rating') ? 1 : -1));
				setDocList(sortRating);
				setListMode('rating');
				setWaiting(false);
				break;
		}
	}

	async function getData() {
		await getDocuments(auth.currentUser!.uid, media, listMode).then((snapshot) => {
			//console.log('get documents promise');
			setDocList(snapshot.docs);
		});

		setWaiting(false);
	}

	async function saveDoc() {
		const valid = validateForm();

		if (valid) {
			let imageName = 'noimage.jpg';

			if (saveMode === 'Edit') {
				imageName = oldImageName;
			}

			if (image) {
				imageName = generateImageName(30);
			}

			var docData = {};

			switch (media) {
				case 'games':
					docData = {
						title: title,
						developer: developer,
						platform: platform,
						genre: genre,
						complete: Timestamp.fromDate(complete),
						rating: rating,
						image: imageName,
					};
					break;
				case 'books':
					docData = {
						title: title,
						author: author,
						genre: genre,
						complete: Timestamp.fromDate(complete),
						rating: rating,
						image: imageName,
					};
					break;
				case 'movies':
					docData = {
						title: title,
						director: director,
						starring: starring,
						genre: genre,
						complete: Timestamp.fromDate(complete),
						rating: rating,
						image: imageName,
					};
					break;
			}

			//console.log('Game Added');
			if (saveMode === 'Add') {
				await addDocument(auth.currentUser!.uid, media, docData, imageName, image).then(() => {
					//console.log(docData);
					toggleAddModal();
					getData();
				});
			} else if (saveMode === 'Edit') {
				await editDocument(auth.currentUser!.uid, media, docData, editID, imageName, image).then(() => {
					toggleAddModal();
					getData();
				});
			}
		} else {
			setErrors(true);
		}
	}

	function validateForm(): Boolean {
		let valid = true;

		if (title === '') {
			valid = false;
			setErrorMsg('Title field is required');
		} else if (media === 'games' && developer === '') {
			valid = false;
			setErrorMsg('Developer field is required');
		} else if (media === 'games' && platform === '') {
			valid = false;
			setErrorMsg('Platform field is required');
		} else if (media === 'books' && author === '') {
			valid = false;
			setErrorMsg('Author field is required');
		} else if (media === 'movies' && director === '') {
			valid = false;
			setErrorMsg('Director field is required');
		} else if (media === 'movies' && starring === '') {
			valid = false;
			setErrorMsg('Starring field is required');
		} else if (genre === '') {
			valid = false;
			setErrorMsg('Genre field is required');
		} else if (rating < 1 || rating > 5) {
			valid = false;
			setErrorMsg('Rating must be between 1 and 5');
		} else if (complete === null) {
			valid = false;
			setErrorMsg('Completion Date is required');
		}

		return valid;
	}

	function toggleAddModal() {
		setErrors(false);
		if (addModal) {
			clearForm();
		}
		setAddModal(!addModal);
	}

	function clearForm() {
		setTitle('');
		setDeveloper('');
		setPlatform('');
		setGenre('');
		setRating(1);
		setAuthor('');
		setDirector('');
		setStarring('');
		SetComplete(new Date());
		setImage(null);
		setImageKey(Date());
	}

	function enableEditing(doc: QueryDocumentSnapshot) {
		setTitle(doc.get('title'));
		if (media === 'games') {
			setDeveloper(doc.get('developer'));
			setPlatform(doc.get('platform'));
		}
		if (media === 'books') {
			setAuthor(doc.get('author'));
		}
		if (media === 'movies') {
			setDirector(doc.get('director'));
			setStarring(doc.get('starring'));
		}
		setGenre(doc.get('genre'));
		setRating(doc.get('rating'));
		setOldImageName(doc.get('image'));
		setEditID(doc.id);
		SetComplete(doc.get('complete').toDate());

		toggleAddModal();
	}

	function toggleViewModal() {
		setViewModal(!viewModal);
		if (viewModal) setViewDocImage('');
	}

	function getImage(image: string) {
		getDownloadURL(ref(storage, `/images/${media}/${image}`)).then((url) => {
			setViewDocImage(url);
		});
	}

	function showUniqueFormFields(): JSX.Element {
		switch (media) {
			case 'games':
				return (
					<>
						<div className="w-full text-end">
							<label className="text-right flex-grow">Developer*:</label>
							<input
								type="text"
								className="text-black mb-4"
								onChange={(e) => {
									setDeveloper(e.target.value);
								}}
								value={developer}
								placeholder="Developer"
							/>
						</div>
						<div className="w-full text-end">
							<label className="text-right flex-grow">Platform*:</label>
							<input
								type="text"
								className="text-black mb-4"
								onChange={(e) => {
									setPlatform(e.target.value);
								}}
								value={platform}
								placeholder="Platform"
							/>
						</div>
					</>
				);
			case 'books':
				return (
					<div className="w-full text-end">
						<label className="text-right flex-grow">Author*:</label>
						<input
							type="text"
							className="text-black mb-4"
							onChange={(e) => {
								setAuthor(e.target.value);
							}}
							value={author}
							placeholder="Author"
						/>
					</div>
				);
			case 'movies':
				return (
					<>
						<div className="w-full text-end">
							<label className="text-right flex-grow">Director*:</label>
							<input
								type="text"
								className="text-black mb-4"
								onChange={(e) => {
									setDirector(e.target.value);
								}}
								value={director}
								placeholder="Director"
							/>
						</div>
						<div className="w-full text-end">
							<label className="text-right flex-grow">Starring*:</label>
							<input
								type="text"
								className="text-black mb-4"
								onChange={(e) => {
									setStarring(e.target.value);
								}}
								value={starring}
								placeholder="Starring"
							/>
						</div>
					</>
				);
				break;
			default:
				return <></>;
		}
	}

	function toggleSelect() {
		setOpenSelect(!openSelect);
	}

	return (
		<>
			<div className={`${errors ? 'block' : 'hidden'} text-3xl animate-pulse w-screen bg-red-700 text-center fixed z-50 inset-x-0`}>{errorsMsg}</div>
			<ModalWrapper modalState={addModal} modalToggle={toggleAddModal}>
				<h1 className="mx-auto">{saveMode} Game</h1>
				<form className="flex flex-col my-auto w-fit mx-auto ">
					<p className="mb-4 mx-auto">Field marked with an asterisk* are required</p>
					<div className="w-full text-end">
						<label className="text-right flex-grow">Title*:</label>
						<input
							type="text"
							className="text-black mb-4"
							onChange={(e) => {
								setTitle(e.target.value);
							}}
							value={title}
							placeholder="Title"
						/>
					</div>
					{showUniqueFormFields()}
					<div className="w-full text-end">
						<label className="text-right flex-grow">Genre*:</label>
						<input
							type="text"
							className="text-black mb-4"
							onChange={(e) => {
								setGenre(e.target.value);
							}}
							value={genre}
							placeholder="Genre"
						/>
					</div>
					<div className="w-full text-end">
						<label className="text-right">Completion Date*:</label>
						<DatePicker
							onKeyDown={(e) => {
								//this prevents user from editing the date by typing in the textfield
								e.preventDefault();
							}}
							selected={complete}
							onChange={(date) => SetComplete(date!)}
							className="text-black mb-4"
						/>
					</div>
					<div className="w-full text-end">
						<RatingSelect setRating={setRating} rating={rating} />
					</div>

					<div className="w-1/2 place-content-end mx-auto">
						<label className="text-right">Image:</label>
						<input
							className="text-sm text-wrap"
							type="file"
							accept="image/*"
							key={imageKey}
							onChange={(e) => {
								setImage(e.target.files ? e.target.files[0] : null);
							}}
						/>
					</div>
				</form>
				<div className="flex flex-row justify-evenly w-full mt-4">
					<button onClick={saveDoc} className=" button transition-all duration-500 ease-in-out">
						<div className=" mx-4 items-center">
							<Image src={SaveIcon} alt="save" height={24} width={24} className="float-left mr-2" />
							Save
						</div>
					</button>
					<button onClick={toggleAddModal} className=" button transition-all duration-500 ease-in-out">
						<div className=" mx-4 items-center">
							<Image src={CloseIcon} alt="cancel" height={24} width={24} className="float-left mr-2" />
							Cancel
						</div>
					</button>
				</div>
			</ModalWrapper>
			<ModalWrapper modalState={viewModal} modalToggle={toggleViewModal}>
				<div className="columns-1 w-4/5 mx-auto">
					<div className={` mx-auto w-full h-72 place-content-center`}>
						<img src={viewDocImage} alt="" className="m-auto" />
					</div>
					<p>{viewDoc?.get('title')}</p>
					<p>{viewDoc?.get('developer')}</p>
					<p>{viewDoc?.get('platform')}</p>
					<p>{viewDoc?.get('genre')}</p>
					<p>{dateFormat.format(viewDoc?.get('complete').toDate())}</p>
					<p>{viewDoc?.get('rating')}</p>
				</div>
			</ModalWrapper>
			<section title={`${media}`} className="md:w-3/5 w-full h-fit mx-auto my-10">
				<div id="game-screen-sort-add" className="w-full flex flex-row flex-wrap items-center justify-start mx-auto card p-4 shadow-lg shadow-black">
					<div className="flex flex-row flex-wrap flex-grow md:justify-start justify-center items-center">
						{/* <h4 className="mr-4">Year:</h4>
						<select
							onChange={(e) => {
								setSelect(e.target.value);
							}}
							value={select}
							className="rounded-md text-black p-2 mr-4">
							<option value={2024}>2024</option>
							<option value={2025}>2025</option>
						</select> */}

						<h4 className="mr-4">Sort By:</h4>
						<div className="w-fit flex toggle-button-container shadow-md shadow-black">
							<button
								className={`toggle-button rounded-s-3xl ${
									listMode === 'complete' ? ' opacity-100 pointer-events-none' : 'opacity-50 pointer-events-auto'
								} transition-opacity duration-500 ease-in-out`}
								onClick={() => {
									sortList(1);
								}}>
								<Image src={DateIcon} alt="date" height={24} width={24} className="float-left mr-2" />
								Completion
							</button>
							<div className="toggle-button-divider"></div>
							<button
								className={`toggle-button rounded-e-3xl ${
									listMode === 'rating' ? 'opacity-100 pointer-events-none' : 'opacity-50 pointer-events-auto'
								} transition-all duration-500 ease-in-out`}
								onClick={() => {
									sortList(2);
								}}>
								<Image src={Star} alt="rating" height={24} width={24} className="float-left mr-2" />
								Rating
							</button>
						</div>
					</div>

					<button
						className=" button w-fit justify-self-end mx-auto transition-color duration-500 ease-in-out mt-4 md:mt-0 shadow-md shadow-black"
						onClick={() => {
							setSaveMode('Add');
							toggleAddModal();
						}}>
						<div className="mx-4">
							<Image src={AddIcon} alt="add new" height={24} width={24} className="float-left mr-2" />
							Add New
						</div>
					</button>
				</div>
				{!waiting && (
					<div className="lg:w-4/5 w-full mx-auto">
						{docList?.length === 0 ? (
							<h2 className="mx-auto my-10 text-center">No Entries</h2>
						) : (
							docList?.map((doc) => {
								return (
									<div key={doc.id} className="my-8 mx-auto">
										<ListCard
											doc={doc}
											editDoc={() => {
												setSaveMode('Edit');
												enableEditing(doc);
											}}
											viewDoc={() => {
												setViewDoc(doc);
												getImage(doc.get('image'));
												toggleViewModal();
											}}
											media={media}
										/>
									</div>
								);
							})
						)}
					</div>
				)}
			</section>
		</>
	);
}
