'use client';

import { auth, db, collections, getGames, getBooks } from './util/firebase/firebase-app';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, orderBy, limit, QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { useState, useEffect, MouseEventHandler } from 'react';
import { useRouter } from 'next/navigation';
import { HomeGameCard } from './components/cards/game-card';
import { HomeBookCard } from './components/cards/book-card';
import StatCard from './components/cards/stat-card';

export default function Home() {
	const [currentUser, setCurrentUser] = useState(auth.currentUser);
	const router = useRouter();

	const [gameSnap, setGameSnap] = useState<QuerySnapshot>();
	const [bookSnap, setBookSnap] = useState<QuerySnapshot>();

	const [latestGame, setLatestGame] = useState<QueryDocumentSnapshot>();
	const [latestBook, setlatestBook] = useState<QueryDocumentSnapshot>();

	const [waiting, setWaiting] = useState(true);

	async function getData() {
		const gameQuerySnap = await getGames(currentUser!.uid);
		const bookQuerySnap = await getBooks(currentUser!.uid);

		setGameSnap(gameQuerySnap);
		setBookSnap(bookQuerySnap);

		setLatestGame(gameQuerySnap.docs[0]);
		setlatestBook(bookQuerySnap.docs[0]);

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
				<div className="flex flex-col my-10 w-full">
					<h1 id="home-welcome" className="mx-auto mb-10">
						Welcome {currentUser!.displayName}
					</h1>
					<div id="home-content" className="flex flex-row flex-wrap justify-evenly mt-4 w-full">
						<div id="home-latest" className="flex flex-col flex-grow p-4 rounded-xl ">
							<h2 className="mx-auto mb-4">Your Latest:</h2>
							<div className="flex flex-row flex-wrap gap-4 lg:justify-evenly">
								{latestGame && <HomeGameCard gameDoc={latestGame} />}
								{latestBook && <HomeBookCard bookDoc={latestBook} />}
							</div>
						</div>

						<div id="home-stats" className="flex flex-col lg:w-1/3 w-full rounded-xl mx-auto p-4">
							<h2 className="mx-auto">Your Stats:</h2>
							{!waiting && <StatCard snapshots={{ games: gameSnap!, books: bookSnap! }} />}
						</div>
					</div>
				</div>
			)}
		</>
	);
}
