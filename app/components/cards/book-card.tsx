'use client';
import { MouseEventHandler, useEffect, useState } from 'react';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import { storage } from '@/app/util/firebase/firebase-app';
import { getDownloadURL, ref } from 'firebase/storage';
import { HomeLoadingCard, ListLoadingCard } from './loading-card';
import { Star } from '@/app/public/icons/icons';

function HomeBookCard({ bookDoc }: { bookDoc: QueryDocumentSnapshot }) {
	const book = bookDoc.data();
	const date = book.complete.toDate();
	const [stars, setStars] = useState<boolean[]>([false, false, false, false, false]);

	const [image, setImage] = useState('');
	const formattedDate = new Intl.DateTimeFormat('en-US', {
		month: 'long',
		day: '2-digit',
		year: 'numeric',
	}).format(date);

	useEffect(() => {
		getDownloadURL(ref(storage, `/images/books/${book.image}`)).then((url) => {
			setImage(url);
		});
		let array: boolean[] = [false, false, false, false, false];
		for (let i = 0; i < bookDoc.get('rating'); i++) {
			array[i] = true;
		}
		setStars(array);
	}, []);

	return (
		<div className="columns-1 h-96 mx-auto">
			<h3 className="mx-auto mb-4 text-center">Book</h3>
			{image === '' ? (
				<HomeLoadingCard />
			) : (
				<div className="card shadow-md shadow-slate-950 p-4 items-center md:w-96 w-full h-72 justify-between">
					<img src={image} className="max-w-32" />
					<div className=" m-2 h-full flex flex-col justify-evenly text-lg">
						<p>{book.title}</p>
						<p>{book.author}</p>
						<p>{book.genre}</p>
						<p>{formattedDate}</p>
						<div className="w-full flex flex-row">
							{stars?.map((star, i) => {
								return <Image key={i} src={Star} alt="star" width={36} height={36} className={`${star ? 'opacity-100' : 'opacity-25'}`} />;
							})}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

function BookListCard({ bookDoc, editBook, viewBook }: { bookDoc: QueryDocumentSnapshot; editBook: MouseEventHandler; viewBook: MouseEventHandler }) {
	const book = bookDoc.data();
	const date = book.complete.toDate();
	var stars: boolean[] = [false, false, false, false, false];
	for (let i = 0; i < book.rating; i++) {
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
		getDownloadURL(ref(storage, `/images/books/${book.image}`)).then((url) => {
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
						<p className="text-2xl">{book.title}</p>
						<p className="hidden lg:block">{book.author}</p>
						<p className="hidden lg:block">{book.genre}</p>
						<p>{formattedDate}</p>
						<div className="w-fit flex flex-row mx-auto md:hidden">
							{stars?.map((star, i) => {
								return <Image key={i} src={Star} alt="star" width={36} height={36} className={`${star ? 'opacity-100' : 'opacity-25'}`} />;
							})}
						</div>
					</div>
					<div className="flex md:flex-col flex-row justify-around items-center lg:w-1/6 w-full ml-2 lg:ml-0 md:h-3/4 h-fit">
						<button className="lg:hidden p-1 bg-purple-800 w-24 h-12 rounded-3xl hover:bg-purple-500 transition-color duration-500 ease-in-out" onClick={viewBook}>
							View
						</button>
						<button className="p-1 bg-purple-800 w-24 h-12 rounded-3xl hover:bg-purple-500 transition-color duration-500 ease-in-out" onClick={editBook}>
							Edit
						</button>
					</div>
				</div>
			)}
		</>
	);
}

export { HomeBookCard, BookListCard };
