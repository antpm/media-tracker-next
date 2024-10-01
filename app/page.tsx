'use client';

import { auth, db, collections } from './util/firebase/firebase-app';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, orderBy, limit, QueryDocumentSnapshot } from 'firebase/firestore';
import { useState, useEffect, MouseEventHandler } from 'react';
import { useRouter } from 'next/navigation';
import { HomeGameCard } from './components/cards/game-card';
import { HomeBookCard } from './components/cards/book-card';

export default function Home() {
	const [currentUser, setCurrentUser] = useState(auth.currentUser);
	const router = useRouter();

	const [latestGame, setLatestGame] = useState<QueryDocumentSnapshot>();
	const [gameCount, setGameCount] = useState(0);
	const [latestBook, setlatestBook] = useState<QueryDocumentSnapshot>();
	const [bookCount, setBookCount] = useState(0);

	const [waiting, setWaiting] = useState(true);

	async function getData() {
		const gameRef = collection(db, collections.users, currentUser!.uid, collections.games);
		const bookRef = collection(db, collections.users, currentUser!.uid, collections.books);

		const latestGameQuery = query(gameRef, orderBy('complete', 'desc'));
		const latestBookQuery = query(bookRef, orderBy('complete', 'desc'));

		const gameQuerySnap = await getDocs(latestGameQuery);
		const bookQuerySnap = await getDocs(latestBookQuery);

		setLatestGame(gameQuerySnap.docs[0]);
		setGameCount(gameQuerySnap.size);
		setlatestBook(bookQuerySnap.docs[0]);
		setBookCount(bookQuerySnap.size);

		setWaiting(false);
	}

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user);
		});

		currentUser ? getData() : router.push('/login');

		return () => unsubscribe();
	}, []);

	return (
		<>
			{currentUser && (
				<div className="flex flex-col h-full">
					<div className="mx-auto my-4 text-2xl">Welcome {currentUser!.displayName}</div>
					<div className="my-4 w-10/12 h-full mx-auto flex flex-row flex-wrap justify-center gap-10">
						{!waiting && <HomeGameCard gameDoc={latestGame!} />}
						{!waiting && <HomeBookCard bookDoc={latestBook!} />}
					</div>
					<div className="mx-auto my-4 text-2xl flex flex-col">
						<p>Statistics</p>
						<p className="">Games: {gameCount}</p>
						<p>Books: {bookCount}</p>
					</div>
				</div>
			)}
		</>
	);
}
