'use client';
import { MouseEventHandler, useState } from 'react';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import { storage } from '@/app/util/firebase/firebase-app';
import { getDownloadURL, ref } from 'firebase/storage';
import LoadingCard from './loading-card';

function HomeGameCard({ gameDoc }: { gameDoc: QueryDocumentSnapshot }) {
	const game = gameDoc.data();
	const date = game.complete.toDate();
	const [image, setImage] = useState('');
	const formattedDate = new Intl.DateTimeFormat('en-US', {
		month: 'long',
		day: '2-digit',
		year: 'numeric',
	}).format(date);

	getDownloadURL(ref(storage, `/images/games/${game.image}`)).then((url) => {
		setImage(url);
	});

	return (
		<div className="columns-1 h-96 mx-auto">
			<h3 className="mx-auto mb-4 text-center">Game</h3>
			{image === '' ? (
				<LoadingCard />
			) : (
				<div className="card border-gray-500 shadow-md shadow-slate-950 p-4 items-center md:w-96 w-full min-h-72">
					<img src={image} className="max-w-32" />
					<div className=" m-2 h-full flex flex-col justify-evenly text-lg">
						<p>{game.title}</p>
						<p>{game.developer}</p>
						<p>{game.platform}</p>
						<p>{game.genre}</p>
						<p>{formattedDate}</p>
						<p>{game.rating}</p>
					</div>
				</div>
			)}
		</div>
	);
}

function GameListCard({ gameDoc, editGame }: { gameDoc: QueryDocumentSnapshot; editGame: MouseEventHandler }) {
	const game = gameDoc.data();
	const date = game.complete.toDate();
	const [image, setImage] = useState('');
	const formattedDate = new Intl.DateTimeFormat('en-US', {
		month: 'long',
		day: '2-digit',
		year: 'numeric',
	}).format(date);

	getDownloadURL(ref(storage, `/images/games/${game.image}`)).then((url) => {
		setImage(url);
	});
	return (
		<>
			{image === '' ? (
				<div>Loading...</div>
			) : (
				<div className="lg:w-full mx-auto w-11/12 border-gray-500 shadow-md shadow-slate-950 card p-2 h-72 items-center justify-center rounded-xl text-lg">
					<div className="w-1/3 hidden lg:flex h-64 items-center justify-center">
						<img src={image} className=" max-w-44" />
					</div>
					<div className="flex flex-col justify-around lg:w-1/3 w-3/4 h-3/4">
						<p>{game.title}</p>
						<p className="hidden lg:block">{game.developer}</p>
						<p className="hidden lg:block">{game.platform}</p>
						<p className="hidden lg:block">{game.genre}</p>
						<p>{formattedDate}</p>
						<p>{game.rating}</p>
					</div>
					<div className="flex flex-col justify-around items-center w-1/3 h-3/4">
						<button className="lg:hidden p-1 bg-purple-800 w-24 h-12 rounded-xl">View</button>
						<button className="p-1 bg-purple-800 w-24 h-12 rounded-xl" onClick={editGame}>
							Edit
						</button>
					</div>
				</div>
			)}
		</>
	);
}

export { HomeGameCard, GameListCard };
