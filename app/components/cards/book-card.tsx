'use client';
import { useState } from 'react';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import { storage } from '@/app/util/firebase/firebase-app';
import { getDownloadURL, ref } from 'firebase/storage';

function HomeBookCard({ bookDoc }: { bookDoc: QueryDocumentSnapshot }) {
	const book = bookDoc.data();
	const date = book.complete.toDate();
	const [image, setImage] = useState('');
	const formattedDate = new Intl.DateTimeFormat('en-US', {
		month: 'long',
		day: '2-digit',
		year: 'numeric',
	}).format(date);

	getDownloadURL(ref(storage, `/images/books/${book.image}`)).then((url) => {
		setImage(url);
	});

	return (
		<div className="flex flex-col w-fit lg:max-w-md">
			<h3 className="mx-auto mb-4">Book</h3>
			<div className="card border-gray-500 shadow-md shadow-slate-950 p-4 gap-2 flex items-center max-w-md">
				{image === '' ? (
					<div className="w-4/5 h-4/5 bg-gray-600 animate-pulse rounded-xl text-gray-400 flex items-center justify-center">Loading...</div>
				) : (
					<img src={image} className="max-w-32" />
				)}

				<div className=" m-2 h-full flex flex-col justify-evenly text-lg">
					<p>{book.title}</p>
					<p>{book.author}</p>
					<p>{book.genre}</p>
					<p>{formattedDate}</p>
					<p>{book.rating}</p>
				</div>
			</div>
		</div>
	);
}

export { HomeBookCard };
