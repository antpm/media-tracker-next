'use client';
import { useState } from 'react';
import Modal from '../components/modal';

export default function Games() {
	const [modal, setModal] = useState(false);
	const [mode, setMode] = useState<string>('');

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
			<Modal modalState={modal} modalToggle={toggleModal} saveFunction={saveGame} media="Game" mode={mode}>
				<p>I am some content for this modal</p>
			</Modal>
			<div className="w-full h-full flex flex-col">
				<button
					onClick={() => {
						setMode('Add');
						toggleModal();
					}}
					className="bg-gray-500 m-auto"
				>
					Add Game
				</button>
				<button
					onClick={() => {
						setMode('Edit');
						toggleModal();
					}}
					className="bg-gray-500 m-auto"
				>
					Edit Game
				</button>
			</div>
		</>
	);
}
