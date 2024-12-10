'use client';
import { useEffect, useState } from 'react';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import { storage } from '@/app/util/firebase/firebase-app';
import { getDownloadURL, ref } from 'firebase/storage';
import { HomeLoadingCard } from './loading-card';
import { Star } from '@/public/icons/icons';

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
		});
		let array: boolean[] = [false, false, false, false, false];
		for (let i = 0; i < data.rating; i++) {
			array[i] = true;
		}
		setStars(array);
	}, []);

	function showUniqueData(): JSX.Element {
		switch (media) {
			case 'games':
				return (
					<>
						<p>Developer: {data.developer}</p>
						<p>Platform: {data.platform}</p>
					</>
				);
			case 'books':
				return (
					<>
						<p>Author: {data.author}</p>
					</>
				);
			case 'movies':
				return (
					<>
						<p>Director: {data.director}</p>
						<p>Starring: {data.starring}</p>
					</>
				);
			case 'tv':
				return (
					<>
						<p>Starring: {data.starring}</p>
					</>
				);
			default:
				return <></>;
		}
	}

	return (
		<>
			{image === '' ? (
				<HomeLoadingCard />
			) : (
				<div className="card md:flex-row flex-col shadow-md shadow-slate-950 p-4 items-center min-h-72 w-full justify-start">
					<div className="mx-2">
						<img src={image} className="max-h-52 max-w-52 mx-2 mb-4 rounded-md" />
						<div className="w-full flex flex-row justify-center mx-auto">
							{stars?.map((star, i) => {
								return <Image key={i} src={Star} alt="star" className={`${star ? 'opacity-100' : 'opacity-25'} md:w-9 md:h-9 w-6 h-6`} />;
							})}
						</div>
					</div>
					<div className=" m-2 min-h-60 flex flex-col justify-evenly text-lg gap-2 w-full">
						<p className="text-2xl">{data.title}</p>
						{showUniqueData()}
						<p>Genre: {data.genre}</p>
						<p>{formattedDate}</p>
					</div>
				</div>
			)}
		</>
	);
}
