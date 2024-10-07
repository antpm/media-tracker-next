'use client';
import { useEffect, useState } from 'react';
import AddModal from '../components/add-modal';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, generateImageName, addDocument } from '../util/firebase/firebase-app';
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
	const [gameSnap, setGameSnap] = useState<QuerySnapshot>();
	const [games, setGames] = useState<QueryDocumentSnapshot[]>();
	const [waiting, setWaiting] = useState(true);
	const [listMode, setListMode] = useState('complete');

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
		currentUser ? getData() : router.push('/login');

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
		const gameQuerySnap = await getDocuments(currentUser!.uid, 'games');
		setGames(gameQuerySnap.docs);
		setGameSnap(gameQuerySnap);
		setWaiting(false);
	}

	async function saveGame() {
		const imageName = generateImageName(30);

		const docData = {
			title: title,
			developer: developer,
			platform: platform,
			genre: genre,
			complete: Timestamp.fromDate(complete),
			rating: rating,
			image: imageName,
		};

		if (mode === 'Add') {
			console.log('Game Added');
			await addDocument(currentUser!.uid, 'games', docData, imageName, image!).then(() => {
				console.log(docData);
				toggleModal();
				getData();
			});
		} else {
			console.log('Game Edited');
		}
	}

	function toggleModal() {
		clearForm();
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

	return (
		<>
			{currentUser && (
				<>
					<AddModal modalState={modal} modalToggle={toggleModal} saveFunction={saveGame} media="Game" mode={mode}>
						<form className="flex flex-col my-auto w-3/4">
							<label>Title:</label>
							<input
								type="text"
								className="text-black mb-4"
								onChange={(e) => {
									setTitle(e.target.value);
								}}
								value={title}
								placeholder="Title"
							/>

							<label>Developer:</label>
							<input
								type="text"
								className="text-black mb-4"
								onChange={(e) => {
									setDeveloper(e.target.value);
								}}
								value={developer}
								placeholder="Developer"
							/>

							<label>Platform:</label>
							<input
								type="text"
								className="text-black mb-4"
								onChange={(e) => {
									setPlatform(e.target.value);
								}}
								value={platform}
								placeholder="Platform"
							/>

							<label>Genre:</label>
							<input
								type="text"
								className="text-black mb-4"
								onChange={(e) => {
									setGenre(e.target.value);
								}}
								value={genre}
								placeholder="Genre"
							/>

							<label>Rating:</label>
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
							<label>Completion Date:</label>
							<DatePicker selected={complete} onChange={(date) => SetComplete(date!)} className="text-black mb-4" />
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
					<section title="Games Page" className="md:w-3/5 w-full h-4/5 mx-auto pb-10 mt-20">
						<div id="game-screen-sort-add" className="w-4/5  flex flex-row flex-wrap items-center justify-start mx-auto">
							<div className="flex flex-row flex-grow md:justify-start justify-center items-center">
								<h4>Sort By:</h4>
								<div className="w-fit flex rounded-xl">
									<button
										className={`p-1 rounded-s-xl w-24 h-12  ${listMode === 'complete' ? 'bg-purple-800 opacity-100' : 'opacity-50  bg-purple-950'} transition-opacity duration-500`}
										onClick={() => {
											sortGames(1);
										}}
									>
										Completion
									</button>
									<button
										className={` p-1 rounded-e-xl w-24 h-12 ${listMode === 'rating' ? 'bg-purple-800 opacity-100' : 'opacity-50 bg-purple-950'} transition-opacity duration-500`}
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
							<div className="lg:w-4/5 w-full mt-12 mx-auto h-full">
								{games?.map((doc) => {
									return (
										<div key={doc.id} className="my-4 mx-auto">
											<GameListCard
												gameDoc={doc}
												editGame={() => {
													setMode('Edit');
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
