'use client';
import { useEffect, useState } from 'react';
import Modal from '../components/modal';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../util/firebase/firebase-app';
import { useRouter } from 'next/navigation';
import { getGames } from '../util/firebase/firebase-app';
import { QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { list } from 'firebase/storage';
import { GameListCard } from '../components/cards/game-card';

export default function Games() {
	const [currentUser, setCurrentUser] = useState(auth.currentUser);
	const [modal, setModal] = useState(false);
	const [mode, setMode] = useState<string>('');
	const router = useRouter();
	const [gameSnap, setGameSnap] = useState<QuerySnapshot>();
	const [games, setGames] = useState<QueryDocumentSnapshot[]>();
	const [waiting, setWaiting] = useState(true);
	const [listMode, setListMode] = useState('complete');

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
		const gameQuerySnap = await getGames(currentUser!.uid);
		setGames(gameQuerySnap.docs);
		setGameSnap(gameQuerySnap);
		setWaiting(false);
	}

	function saveGame() {
		if (mode === 'Add') {
			console.log('Game Added');
			toggleModal();
		} else {
			console.log('Game Edited');
			toggleModal();
		}
	}

	function toggleModal() {
		setModal(!modal);
	}

	return (
		<>
			{currentUser && (
				<>
					<Modal modalState={modal} modalToggle={toggleModal} saveFunction={saveGame} media="Game" mode={mode} />
					<section title="Games Page" className="md:w-3/5 w-full h-4/5 mx-auto mt-20">
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
