'use client';
import { useState } from 'react';
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
				<div className="card border-gray-500 shadow-md shadow-slate-950 p-4 items-center w-96 h-72">
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

function ListGameCard({ gameDoc }: { gameDoc: any }) {}

export { HomeGameCard, ListGameCard };
