'use client';

import { auth, getDocuments } from './util/firebase/firebase-app';
import { onAuthStateChanged } from 'firebase/auth';
import { QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';
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
		const gameQuerySnap = await getDocuments(currentUser!.uid, 'games', 'complete');
		const bookQuerySnap = await getDocuments(currentUser!.uid, 'books', 'complete');

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

		currentUser ? getData() : router.push('/login', { scroll: false });

		return () => unsubscribe();
	}, []);

	return (
		<>
			{currentUser && (
				<section title="Home Page" className="flex flex-col my-10 max-w-full">
					<h1 className="mx-auto mb-10">Welcome {currentUser!.displayName}</h1>
					<div id="home-content" className="flex flex-row flex-wrap justify-evenly mt-4 w-full">
						<section title="Your Latest" className="flex flex-col flex-grow p-4 rounded-xl ">
							<h2 className="mx-auto mb-4">Your Latest:</h2>
							<div className="flex flex-row flex-wrap gap-4 lg:justify-evenly max-w-full">
								{latestGame && <HomeGameCard gameDoc={latestGame} />}
								{latestBook && <HomeBookCard bookDoc={latestBook} />}
							</div>
						</section>

						<section title="Your Stats" className="flex flex-col lg:w-1/3 w-full rounded-xl mx-auto p-4">
							<h2 className="mx-auto">Your Stats:</h2>
							{!waiting && <StatCard snapshots={{ games: gameSnap!, books: bookSnap! }} />}
						</section>
					</div>
				</section>
			)}
		</>
	);
}
