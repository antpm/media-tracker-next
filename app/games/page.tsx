'use client';
import { useEffect, useState } from 'react';
import AddModal from '../components/add-modal';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, generateImageName, addDocument, editDocument } from '../util/firebase/firebase-app';
import { useRouter } from 'next/navigation';
import { getDocuments } from '../util/firebase/firebase-app';
import { QueryDocumentSnapshot, QuerySnapshot, Timestamp } from 'firebase/firestore';
import { list } from 'firebase/storage';
import { GameListCard } from '../components/cards/game-card';
import DatePicker from 'react-datepicker';

export default function Games() {
	const [currentUser, setCurrentUser] = useState(auth.currentUser);
	const [modal, setModal] = useState(false);
	const [mode, setMode] = useState<string>('');
	const router = useRouter();
	const [games, setGames] = useState<QueryDocumentSnapshot[]>();
	const [waiting, setWaiting] = useState(true);
	const [listMode, setListMode] = useState('complete');
	const [errors, setErrors] = useState(false);
	const [errorsMsg, setErrorMsg] = useState('');
	const [oldImageName, setOldImageName] = useState('');
	const [editID, setEditID] = useState('');

	const [title, setTitle] = useState('');
	const [genre, setGenre] = useState('');
	const [platform, setPlatform] = useState('');
	const [developer, setDeveloper] = useState('');
	const [rating, setRating] = useState(1);
	const [complete, SetComplete] = useState(new Date());
	const [image, setImage] = useState<File | null>(null);
	//in order to get the file input to reset when the modal closes, it is assigned a key which gets changed on close, causing it to be re-rendered
	const [imageKey, setImageKey] = useState(Date());

	const dateFormat = new Intl.DateTimeFormat('en-US', {
		month: 'long',
		day: '2-digit',
		year: 'numeric',
	});

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user);
		});
		console.log('useeffect');
		currentUser ? getData() : router.push('/login', { scroll: false });

		return () => unsubscribe();
	}, []);

	function sortGames(mode: Number) {
		//data from current array must be copied into a new array to trigger re-render when setting state with sorted array
		setWaiting(true);
		const old = [...games!];
		switch (mode) {
			case 1:
				const sortCompleted = old.sort((a, b) => (a.get('complete') < b.get('complete') ? 1 : -1));
				setGames(sortCompleted);
				setListMode('complete');
				setWaiting(false);
				break;
			case 2:
				const sortRating = old.sort((a, b) => (a.get('rating') < b.get('rating') ? 1 : -1));
				setGames(sortRating);
				setListMode('rating');
				setWaiting(false);
				break;
		}
	}

	async function getData() {
		console.log('getData');
		setListMode('complete');
		const gameQuerySnap = await getDocuments(currentUser!.uid, 'games');
		setGames(gameQuerySnap.docs);
		setWaiting(false);
	}

	async function saveGame() {
		const valid = validateForm();

		if (valid) {
			let imageName = 'noimage.jpg';

			if (mode === 'Edit') {
				imageName = oldImageName;
			}

			if (image) {
				imageName = generateImageName(30);
				console.log('image name generated');
			}

			const docData = {
				title: title,
				developer: developer,
				platform: platform,
				genre: genre,
				complete: Timestamp.fromDate(complete),
				rating: rating,
				image: imageName,
			};

			//console.log('Game Added');
			if (mode === 'Add') {
				await addDocument(currentUser!.uid, 'games', docData, imageName, image).then(() => {
					//console.log(docData);
					toggleModal();
					getData();
				});
			} else if (mode === 'Edit') {
				await editDocument(currentUser!.uid, 'games', docData, editID, imageName, image).then(() => {
					toggleModal();
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
		} else if (developer === '') {
			valid = false;
			setErrorMsg('Developer field is required');
		} else if (platform === '') {
			valid = false;
			setErrorMsg('Platform field is required');
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

	function toggleModal() {
		setErrors(false);
		if (modal) {
			clearForm();
		}
		setModal(!modal);
	}

	function clearForm() {
		setTitle('');
		setDeveloper('');
		setPlatform('');
		setGenre('');
		setRating(1);
		SetComplete(new Date());
		setImage(null);
		setImageKey(Date());
	}

	function enableEditing(doc: QueryDocumentSnapshot) {
		setTitle(doc.get('title'));
		setDeveloper(doc.get('developer'));
		setPlatform(doc.get('platform'));
		setGenre(doc.get('genre'));
		setRating(doc.get('rating'));
		setOldImageName(doc.get('image'));
		setEditID(doc.id);
		SetComplete(doc.get('complete').toDate());
	}

	return (
		<>
			{currentUser && (
				<>
					<div className={`${errors ? 'block' : 'hidden'} text-3xl animate-pulse w-screen bg-red-700 text-center fixed z-50 inset-x-0`}>{errorsMsg}</div>
					<AddModal modalState={modal} modalToggle={toggleModal} saveFunction={saveGame} media="Game" mode={mode}>
						<form className="flex flex-col my-auto w-3/4">
							<label>Title*:</label>
							<input
								type="text"
								className="text-black mb-4"
								onChange={(e) => {
									setTitle(e.target.value);
								}}
								value={title}
								placeholder="Title"
							/>

							<label>Developer*:</label>
							<input
								type="text"
								className="text-black mb-4"
								onChange={(e) => {
									setDeveloper(e.target.value);
								}}
								value={developer}
								placeholder="Developer"
							/>

							<label>Platform*:</label>
							<input
								type="text"
								className="text-black mb-4"
								onChange={(e) => {
									setPlatform(e.target.value);
								}}
								value={platform}
								placeholder="Platform"
							/>

							<label>Genre*:</label>
							<input
								type="text"
								className="text-black mb-4"
								onChange={(e) => {
									setGenre(e.target.value);
								}}
								value={genre}
								placeholder="Genre"
							/>

							<label>Rating*:</label>
							<select
								className="w-16 text-black mb-4"
								value={rating}
								onChange={(e) => {
									setRating(Number(e.target.value));
								}}
							>
								<option className="text-end text-black" value={1}>
									1
								</option>
								<option className="text-end text-black" value={2}>
									2
								</option>
								<option className="text-end text-black" value={3}>
									3
								</option>
								<option className="text-end text-black" value={4}>
									4
								</option>
								<option className="text-end text-black" value={5}>
									5
								</option>
							</select>
							<label>Completion Date*:</label>
							<DatePicker
								onKeyDown={(e) => {
									//this prevents user from editing the date by typing in the textfield
									e.preventDefault();
								}}
								selected={complete}
								onChange={(date) => SetComplete(date!)}
								className="text-black mb-4"
							/>
							<label>Image:</label>
							<input
								type="file"
								accept="image/*"
								key={imageKey}
								onChange={(e) => {
									setImage(e.target.files ? e.target.files[0] : null);
								}}
							/>
						</form>
					</AddModal>
					<section title="Games Page" className="md:w-3/5 w-full h-fit mx-auto my-10">
						<div id="game-screen-sort-add" className="w-4/5  flex flex-row flex-wrap items-center justify-start mx-auto">
							<div className="flex flex-row flex-grow md:justify-start justify-center items-center">
								<h4>Sort By:</h4>
								<div className="w-fit flex rounded-xl">
									<button
										className={`p-1 rounded-s-xl w-24 h-12  ${
											listMode === 'complete' ? 'bg-purple-800 opacity-100 pointer-events-none' : 'opacity-50  bg-purple-950 pointer-events-auto'
										} transition-opacity duration-500`}
										onClick={() => {
											sortGames(1);
										}}
									>
										Completion
									</button>
									<button
										className={` p-1 rounded-e-xl w-24 h-12 ${
											listMode === 'rating' ? 'bg-purple-800 opacity-100 pointer-events-none' : 'opacity-50 bg-purple-950 pointer-events-auto'
										} transition-opacity duration-500`}
										onClick={() => {
											sortGames(2);
										}}
									>
										Rating
									</button>
								</div>
							</div>

							<button
								className="p-1 bg-purple-800 w-24 h-12 rounded-xl justify-self-end mx-auto"
								onClick={() => {
									setMode('Add');
									toggleModal();
								}}
							>
								Add Game
							</button>
						</div>
						{!waiting && (
							<div className="lg:w-4/5 w-full mx-auto">
								{games?.map((doc) => {
									return (
										<div key={doc.id} className="my-4 mx-auto">
											<GameListCard
												gameDoc={doc}
												editGame={() => {
													setMode('Edit');
													enableEditing(doc);
													toggleModal();
												}}
											/>
										</div>
									);
								})}
							</div>
						)}
					</section>
				</>
			)}
		</>
	);
}
