'use client';
import { useEffect, useState } from 'react';
import RatingSelect from '../components/rating-select';
import { useRouter } from 'next/navigation';
import { QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import { addDocument, auth, editDocument, generateImageName, getDocuments, storage } from '../util/firebase/firebase-app';
import { getDownloadURL, ref } from 'firebase/storage';
import ModalWrapper from '../components/modal-wrapper';
import DatePicker from 'react-datepicker';
import { BookListCard } from '../components/cards/book-card';

export default function Books() {
	const router = useRouter();

	const [addModal, setAddModal] = useState(false);
	const [viewModal, setViewModal] = useState(false);

	const [saveMode, setSaveMode] = useState<string>('');

	const [books, setBooks] = useState<QueryDocumentSnapshot[]>();
	const [waiting, setWaiting] = useState(true);
	const [listMode, setListMode] = useState('complete');

	const [errors, setErrors] = useState(false);
	const [errorsMsg, setErrorMsg] = useState('');
	const [oldImageName, setOldImageName] = useState('');
	const [editID, setEditID] = useState('');
	const [title, setTitle] = useState('');
	const [genre, setGenre] = useState('');
	const [author, setAuthor] = useState('');
	const [rating, setRating] = useState(1);
	const [complete, SetComplete] = useState(new Date());
	const [image, setImage] = useState<File | null>(null);
	//in order to get the file input to reset when the modal closes, it is assigned a key which gets changed on close, causing it to be re-rendered
	const [imageKey, setImageKey] = useState(Date());

	const [viewBook, setViewBook] = useState<QueryDocumentSnapshot | null>(null);
	const [viewBookImage, setViewBookImage] = useState('');

	const dateFormat = new Intl.DateTimeFormat('en-US', {
		month: 'long',
		day: '2-digit',
		year: 'numeric',
	});

	function sleep(time: number) {
		return new Promise((resolve) => setTimeout(resolve, time));
	}

	useEffect(() => {
		//firebase's auth persistance has a delay on re-authenticating the user, so we check if auth has a currentUser and if not we wait 1 second and check again
		//if auth still doesn't have a currentUser after the wait, we push to login
		//without the sleep, users would get routed to login when navigating to this page using the address bar or refreshing
		//then login would route them to home since firebase would have re-authenticated by the time the page loads
		//there is probably a better way to handle this
		if (!auth.currentUser) {
			//in my testing, a sleep as low as 140 allows users to refresh the page without getting routed to login
			sleep(1000).then(() => {
				auth.currentUser ? getData() : router.push('/login', { scroll: false });
			});
		} else {
			getData();
		}

		/* const unsubscribe = onAuthStateChanged(auth, (user) => {
			console.log('authstatechangeuser: ', user);
			setCurrentUser(user);
		});

		return () => unsubscribe(); */
	}, []);

	function sortBooks(mode: Number) {
		//data from current array must be copied into a new array to trigger re-render when setting state with sorted array
		setWaiting(true);
		const old = [...books!];
		switch (mode) {
			case 1:
				const sortCompleted = old.sort((a, b) => (a.get('complete') <= b.get('complete') ? 1 : -1));
				setBooks(sortCompleted);
				setListMode('complete');
				setWaiting(false);
				break;
			case 2:
				const sortRating = old.sort((a, b) => (a.get('rating') <= b.get('rating') ? 1 : -1));
				setBooks(sortRating);
				setListMode('rating');
				setWaiting(false);
				break;
		}
	}

	async function getData() {
		await getDocuments(auth.currentUser!.uid, 'books', listMode).then((snapshot) => {
			console.log('get documents promise');
			setBooks(snapshot.docs);
		});

		setWaiting(false);
	}

	async function saveBook() {
		const valid = validateForm();

		if (valid) {
			let imageName = 'noimage.jpg';

			if (saveMode === 'Edit') {
				imageName = oldImageName;
			}

			if (image) {
				imageName = generateImageName(30);
				console.log('image name generated');
			}

			const docData = {
				title: title,
				author: author,
				genre: genre,
				complete: Timestamp.fromDate(complete),
				rating: rating,
				image: imageName,
			};

			if (saveMode === 'Add') {
				await addDocument(auth.currentUser!.uid, 'books', docData, imageName, image).then(() => {
					//console.log(docData);
					toggleAddModal();
					getData();
				});
			} else if (saveMode === 'Edit') {
				await editDocument(auth.currentUser!.uid, 'books', docData, editID, imageName, image).then(() => {
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
		} else if (author === '') {
			valid = false;
			setErrorMsg('Author field is required');
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
		setAuthor('');
		setGenre('');
		setRating(1);
		SetComplete(new Date());
		setImage(null);
		setImageKey(Date());
	}

	function enableEditing(doc: QueryDocumentSnapshot) {
		setTitle(doc.get('title'));
		setAuthor(doc.get('author'));
		setGenre(doc.get('genre'));
		setRating(doc.get('rating'));
		setOldImageName(doc.get('image'));
		setEditID(doc.id);
		SetComplete(doc.get('complete').toDate());

		toggleAddModal();
	}

	function toggleViewModal() {
		setViewModal(!viewModal);
		if (viewModal) setViewBookImage('');
	}

	function getImage(image: string) {
		getDownloadURL(ref(storage, `/images/books/${image}`)).then((url) => {
			setViewBookImage(url);
		});
	}

	return (
		<>
			{auth.currentUser && (
				<>
					<div className={`${errors ? 'block' : 'hidden'} text-3xl animate-pulse w-screen bg-red-700 text-center fixed z-50 inset-x-0`}>{errorsMsg}</div>
					<ModalWrapper modalState={addModal} modalToggle={toggleAddModal}>
						<h1 className="mx-auto">{saveMode} Book</h1>
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
							<button onClick={saveBook} className="button transition-all duration-500 ease-in-out">
								Save Book
							</button>
							<button onClick={toggleAddModal} className=" button transition-all duration-500 ease-in-out">
								Cancel
							</button>
						</div>
					</ModalWrapper>
					<ModalWrapper modalState={viewModal} modalToggle={toggleViewModal}>
						<div className="columns-1 w-4/5 mx-auto">
							<div className={` mx-auto w-full h-72 place-content-center`}>
								<img src={viewBookImage} alt="" className="m-auto" />
							</div>
							<p>{viewBook?.get('title')}</p>
							<p>{viewBook?.get('author')}</p>
							<p>{viewBook?.get('platform')}</p>
							<p>{viewBook?.get('genre')}</p>
							<p>{dateFormat.format(viewBook?.get('complete').toDate())}</p>
							<p>{viewBook?.get('rating')}</p>
						</div>
					</ModalWrapper>
					<section title="Books Page" className="md:w-3/5 w-full h-fit mx-auto my-10">
						<div id="book-screen-sort-add" className="w-4/5  flex flex-row flex-wrap items-center justify-start mx-auto">
							<div className="flex flex-row flex-grow md:justify-start justify-center items-center">
								<h4 className="mr-4">Sort By:</h4>
								<div className="w-fit flex rounded-3xl">
									<button
										className={`toggle-button rounded-s-3xl  ${
											listMode === 'complete' ? 'opacity-100 pointer-events-none' : 'opacity-50   pointer-events-auto '
										} transition-opacity duration-500 ease-in-out`}
										onClick={() => {
											sortBooks(1);
										}}>
										Completion
									</button>
									<button
										className={` toggle-button rounded-e-3xl ${
											listMode === 'rating' ? 'opacity-100 pointer-events-none' : 'opacity-50  pointer-events-auto '
										} transition-all duration-500 ease-in-out`}
										onClick={() => {
											sortBooks(2);
										}}>
										Rating
									</button>
								</div>
							</div>

							<button
								className=" w-48 button justify-self-end mx-auto transition-color duration-500 ease-in-out mt-4 md:mt-0 "
								onClick={() => {
									setSaveMode('Add');
									toggleAddModal();
								}}>
								Add Book
							</button>
						</div>
						{!waiting && (
							<div className="lg:w-4/5 w-full mx-auto">
								{books?.map((doc) => {
									return (
										<div key={doc.id} className="my-4 mx-auto">
											<BookListCard
												bookDoc={doc}
												editBook={() => {
													setSaveMode('Edit');
													enableEditing(doc);
												}}
												viewBook={() => {
													setViewBook(doc);
													getImage(doc.get('image'));
													toggleViewModal();
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
