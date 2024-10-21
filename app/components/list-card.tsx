'use client';
import { MouseEventHandler, useEffect, useState } from 'react';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import { storage } from '@/app/util/firebase/firebase-app';
import { getDownloadURL, ref } from 'firebase/storage';
import { ListLoadingCard } from './loading-card';
import { Star } from '@/app/public/icons/icons';

export default function ListCard({ doc, editDoc, viewDoc, media }: { doc: QueryDocumentSnapshot; editDoc: MouseEventHandler; viewDoc: MouseEventHandler; media: string }) {
	const data = doc.data();
	const date = data.complete.toDate();
	var stars: boolean[] = [false, false, false, false, false];
	for (let i = 0; i < data.rating; i++) {
		stars[i] = true;
	}

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
	}, []);

	function showUniqueData(): JSX.Element {
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
		<>
			{image === '' ? (
				<ListLoadingCard />
			) : (
				<div className=" lg:w-full flex flex-row flex-wrap mx-auto w-11/12 border-gray-500 shadow-md shadow-slate-950 card p-2 min-h-60 md:h-56 h-56 items-center justify-evenly rounded-xl text-lg">
					<div className="w-1/3 hidden lg:flex flex-col h-full items-center justify-center">
						<img src={image} className=" max-h-44" />
						<div className="w-fit md:flex flex-row mx-auto hidden mt-2">
							{stars?.map((star, i) => {
								return <Image key={i} src={Star} alt="star" width={36} height={36} className={`${star ? 'opacity-100' : 'opacity-25'}`} />;
							})}
						</div>
					</div>
					<div className="flex flex-col justify-around lg:w-1/2 w-full md:h-full h-2/3 text-center md:text-start">
						<p className="text-2xl">{data.title}</p>
						{showUniqueData()}
						<p className="hidden lg:block">Genre: {data.genre}</p>
						<p>{formattedDate}</p>
						<div className="w-fit flex flex-row mx-auto md:hidden">
							{stars?.map((star, i) => {
								return <Image key={i} src={Star} alt="star" width={36} height={36} className={`${star ? 'opacity-100' : 'opacity-25'}`} />;
							})}
						</div>
					</div>
					<div className="flex md:flex-col flex-row justify-around items-center lg:w-1/6 w-full ml-2 lg:ml-0 md:h-3/4 h-fit">
						<button className="lg:hidden p-1 button transition-color duration-500 ease-in-out shadow-md shadow-black" onClick={viewDoc}>
							View
						</button>
						<button className="p-1 button transition-color duration-500 ease-in-out shadow-md shadow-black" onClick={editDoc}>
							Edit
						</button>
					</div>
				</div>
			)}
		</>
	);
}
