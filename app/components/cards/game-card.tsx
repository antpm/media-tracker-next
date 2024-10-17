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

			//console.log('getdownloadurl');
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

export { HomeGameCard };
