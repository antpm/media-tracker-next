'use client';
import { MouseEventHandler, useEffect, useState } from 'react';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import { storage } from '@/app/util/firebase/firebase-app';
import { getDownloadURL, ref } from 'firebase/storage';
import { HomeLoadingCard } from './loading-card';
import { Star } from '@/app/public/icons/icons';

export default function HomeCard({ doc, media }: { doc: QueryDocumentSnapshot; media: string }) {
	const data = doc.data();
	const date = data.complete.toDate();

	const [stars, setStars] = useState<boolean[]>([false, false, false, false, false]);
	const [image, setImage] = useState('');
	const formattedDate = new Intl.DateTimeFormat('en-US', {
		month: 'long',
		day: '2-digit',
		year: 'numeric',
	}).format(date);

	useEffect(() => {
		getDownloadURL(ref(storage, `/images/${media}/${data.image}`)).then((url) => {
			setImage(url);

			//console.log('getdownloadurl');
		});
		let array: boolean[] = [false, false, false, false, false];
		for (let i = 0; i < data.rating; i++) {
			array[i] = true;
		}
		setStars(array);
	}, []);

	function listUniqueData(): JSX.Element {
		switch (media) {
			case 'games':
				return (
					<>
						<p className="hidden lg:block">Developer: {data.developer}</p>
						<p className="hidden lg:block">Platform: {data.platform}</p>
					</>
				);
			case 'books':
				return (
					<>
						<p className="hidden lg:block">Author: {data.author}</p>
					</>
				);
			default:
				return <></>;
		}
	}

	return (
		<div className="columns-1 h-96 mx-auto">
			{image === '' ? (
				<HomeLoadingCard />
			) : (
				<div className="card flex-row shadow-md shadow-slate-950 p-4 items-center md:w-96 w-full h-72 justify-between">
					<img src={image} className="max-w-32" />
					<div className=" m-2 h-full flex flex-col justify-evenly text-lg">
						<p>{data.title}</p>
						{listUniqueData()}
						<p>Genre: {data.genre}</p>
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
