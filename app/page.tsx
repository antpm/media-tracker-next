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
				<div className="flex flex-col my-10">
					<h1 id="home-welcome" className="mx-auto mb-10 text-2xl">
						Welcome {currentUser!.displayName}
					</h1>
					<div id="home-content" className="flex flex-row flex-wrap justify-evenly mt-4">
						<div id="home-latest" className="flex flex-col max-w-5xl bg-gray-800 p-4 rounded-xl ">
							<h1 className="mx-auto mb-4">Your Latest:</h1>
							<div className="flex flex-row flex-wrap gap-4 lg:justify-evenly">
								{latestGame && <HomeGameCard gameDoc={latestGame!} />}
								{latestBook && <HomeBookCard bookDoc={latestBook!} />}
							</div>
						</div>

						<div id="home-stats" className="flex flex-col lg:w-1/4 w-fit rounded-xl bg-gray-800 p-4">
							<h1 className="mx-auto">Your Stats:</h1>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
