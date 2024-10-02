'use client';
import { useState } from 'react';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import { storage } from '@/app/util/firebase/firebase-app';
import { getDownloadURL, ref } from 'firebase/storage';

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
		<div className="flex flex-col">
			<h1 className="mx-auto">Game</h1>
			<div className="card border-gray-500 shadow-md shadow-slate-950 p-4 flex items-center max-w-md">
				{image === '' ? (
					<div className="w-4/5 h-4/5 bg-gray-600 animate-pulse rounded-xl text-gray-400 flex items-center justify-center">Loading...</div>
				) : (
					<img src={image} className="max-w-48" />
				)}

				<div className=" m-2 h-full flex flex-col">
					<p>{game.title}</p>
					<p>{game.developer}</p>
					<p>{game.platform}</p>
					<p>{game.genre}</p>
					<p>{formattedDate}</p>
					<p>{game.rating}</p>
				</div>
			</div>
		</div>
	);
}

function ListGameCard({ gameDoc }: { gameDoc: any }) {}

export { HomeGameCard, ListGameCard };
