'use client';
import { useEffect, useState } from 'react';
import Modal from '../components/modal';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../util/firebase/firebase-app';
import { useRouter } from 'next/navigation';

export default function Games() {
	const [currentUser, setCurrentUser] = useState(auth.currentUser);
	const [modal, setModal] = useState(false);
	const [mode, setMode] = useState<string>('');
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user);
		});

		!currentUser && router.push('/login');

		return () => unsubscribe();
	}, []);

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
					<Modal modalState={modal} modalToggle={toggleModal} saveFunction={saveGame} media="Game" mode={mode}>
						<p>I am some content for this modal</p>
					</Modal>
					<div id="games-screen-content" className="md:w-3/5 w-4/5 columns-1 mx-auto mt-20">
						<div id="game-screen-sort-add" className="w-full flex flex-row flex-wrap items-center justify-start">
							<div className="flex flex-row flex-grow md:justify-start justify-center items-center">
								<h4>Sort By:</h4>
								<input type="radio" id="game-completion" name="game-sort" className="ml-2" />
								<label className="text-lg">Completion Date</label>
								<input type="radio" id="game-rating" name="game-sort" className="ml-2" />
								<label className="text-lg">Rating</label>
							</div>

							<button
								className="bg-purple-600 rounded-xl p-1 justify-self-end mx-auto"
								onClick={() => {
									setMode('Add');
									toggleModal();
								}}
							>
								Add Game
							</button>
						</div>
					</div>
				</>
			)}
		</>
	);
}
