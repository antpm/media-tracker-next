'use client';
import { MouseEventHandler, useEffect, useState } from 'react';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import { storage } from '@/app/util/firebase/firebase-app';
import { getDownloadURL, ref } from 'firebase/storage';
import { HomeLoadingCard, ListLoadingCard } from './loading-card';
import { Star } from '@/app/public/icons/icons';

function HomeGameCard({ gameDoc }: { gameDoc: QueryDocumentSnapshot }) {
	const game = gameDoc.data();
	const date = game.complete.toDate();

	const [stars, setStars] = useState<boolean[]>([false, false, false, false, false]);
	const [image, setImage] = useState('');
	const formattedDate = new Intl.DateTimeFormat('en-US', {
		month: 'long',
		day: '2-digit',
		year: 'numeric',
	}).format(date);

	useEffect(() => {
		getDownloadURL(ref(storage, `/images/games/${game.image}`)).then((url) => {
			setImage(url);

			console.log('getdownloadurl');
		});
		let array: boolean[] = [false, false, false, false, false];
		for (let i = 0; i < gameDoc.get('rating'); i++) {
			array[i] = true;
		}
		setStars(array);
	}, []);

	return (
		<div className="columns-1 h-96 mx-auto">
			<h3 className="mx-auto mb-4 text-center">Game</h3>
			{image === '' ? (
				<HomeLoadingCard />
			) : (
				<div className="card flex-row shadow-md shadow-slate-950 p-4 items-center md:w-96 w-full h-72 justify-between">
					<img src={image} className="max-w-32" />
					<div className=" m-2 h-full flex flex-col justify-evenly text-lg">
						<p>{game.title}</p>
						<p>{game.developer}</p>
						<p>{game.platform}</p>
						<p>{game.genre}</p>
						<p>{formattedDate}</p>
						<div className="w-full flex flex-row">
							{stars?.map((star, i) => {
								return <Image key={i} src={Star} alt="star" className={`${star ? 'opacity-100' : 'opacity-25'} md:w-9 md:h-9 w-6 h-6`} />;
							})}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

function GameListCard({ gameDoc, editGame, viewGame }: { gameDoc: QueryDocumentSnapshot; editGame: MouseEventHandler; viewGame: MouseEventHandler }) {
	const game = gameDoc.data();
	const date = game.complete.toDate();
	var stars: boolean[] = [false, false, false, false, false];
	for (let i = 0; i < game.rating; i++) {
		stars[i] = true;
	}

	const [image, setImage] = useState('');
	const formattedDate = new Intl.DateTimeFormat('en-US', {
		month: 'long',
		day: '2-digit',
		year: 'numeric',
	}).format(date);

	useEffect(() => {
		console.log('list game card useeffect');
		getDownloadURL(ref(storage, `/images/games/${game.image}`)).then((url) => {
			setImage(url);
		});
	}, []);

	return (
		<>
			{image === '' ? (
				<ListLoadingCard />
			) : (
				<div className=" lg:w-full flex flex-row flex-wrap mx-auto w-11/12 border-gray-500 shadow-md shadow-slate-950 card p-2 md:h-56 h-56 items-center justify-evenly rounded-xl text-lg">
					<div className="w-1/3 hidden lg:flex flex-col h-full items-center justify-center">
						<img src={image} className=" max-h-44" />
						<div className="w-fit md:flex flex-row mx-auto hidden mt-2">
							{stars?.map((star, i) => {
								return <Image key={i} src={Star} alt="star" width={36} height={36} className={`${star ? 'opacity-100' : 'opacity-25'}`} />;
							})}
						</div>
					</div>
					<div className="flex flex-col justify-around lg:w-1/2 w-full md:h-full h-2/3 text-center md:text-start">
						<p className="text-2xl">{game.title}</p>
						<p className="hidden lg:block">{game.developer}</p>
						<p className="hidden lg:block">{game.platform}</p>
						<p className="hidden lg:block">{game.genre}</p>
						<p>{formattedDate}</p>
						<div className="w-fit flex flex-row mx-auto md:hidden">
							{stars?.map((star, i) => {
								return <Image key={i} src={Star} alt="star" width={36} height={36} className={`${star ? 'opacity-100' : 'opacity-25'}`} />;
							})}
						</div>
					</div>
					<div className="flex md:flex-col flex-row justify-around items-center lg:w-1/6 w-full ml-2 lg:ml-0 md:h-3/4 h-fit">
						<button className="lg:hidden p-1 button transition-color duration-500 ease-in-out" onClick={viewGame}>
							View
						</button>
						<button className="p-1 button transition-color duration-500 ease-in-out" onClick={editGame}>
							Edit
						</button>
					</div>
				</div>
			)}
		</>
	);
}

export { HomeGameCard, GameListCard };
