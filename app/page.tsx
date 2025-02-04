'use client';

import { auth, getDocuments } from './util/firebase/firebase-app';
import { onAuthStateChanged } from 'firebase/auth';
import { QueryDocumentSnapshot, QuerySnapshot, Timestamp } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HomeCard from './components/home-card';
import StatCard from './components/stat-card';

export default function Home() {
	const [currentUser, setCurrentUser] = useState(auth.currentUser);
	const router = useRouter();

	const [gameSnap, setGameSnap] = useState<QuerySnapshot>();
	const [bookSnap, setBookSnap] = useState<QuerySnapshot>();
	const [movieSnap, setMovieSnap] = useState<QuerySnapshot>();
	const [tvSnap, setTvSnap] = useState<QuerySnapshot>();

	const [latestGame, setLatestGame] = useState<QueryDocumentSnapshot>();
	const [latestBook, setLatestBook] = useState<QueryDocumentSnapshot>();
	const [latestMovie, setLatestMovie] = useState<QueryDocumentSnapshot>();
	const [latestTv, setLatestTv] = useState<QueryDocumentSnapshot>();

	const [waiting, setWaiting] = useState(true);

	async function getData() {
		const currentYear = new Date().getFullYear();

		const gameQuerySnap = await getDocuments(currentUser!.uid, 'games', 'complete', currentYear);
		const bookQuerySnap = await getDocuments(currentUser!.uid, 'books', 'complete', currentYear);
		const movieQuerySnap = await getDocuments(currentUser!.uid, 'movies', 'complete', currentYear);
		const tvQuerySnap = await getDocuments(currentUser!.uid, 'tv', 'complete', currentYear);

		setGameSnap(gameQuerySnap);
		setBookSnap(bookQuerySnap);
		setMovieSnap(movieQuerySnap);
		setTvSnap(tvQuerySnap);

		setLatestGame(gameQuerySnap.docs[0]);
		setLatestBook(bookQuerySnap.docs[0]);
		setLatestMovie(movieQuerySnap.docs[0]);
		setLatestTv(tvQuerySnap.docs[0]);

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
				<div title="Home Page" className="flex flex-col my-10 max-w-full">
					<h1 className="mx-auto mb-10">Welcome {currentUser!.displayName}</h1>
					<div id="home-content" className="flex flex-wrap justify-center mt-4 w-full">
						<div title="Your Latest" className="flex flex-col flex-grow p-4 rounded-xl w-3/4 items-center">
							<h2 className="mx-auto mb-4">Your Latest:</h2>
							<div className="md:grid md:grid-cols-2 md:gap-8 flex flex-col md:w-3/4 w-full justify-start">
								<div className=" w-full my-4">
									<h3 className="mx-auto mb-4 text-center">Game</h3>
									{latestGame && <HomeCard doc={latestGame} media="games" />}
								</div>
								<div className=" w-full my-4">
									<h3 className="mx-auto mb-4 text-center">Book</h3>
									{latestBook && <HomeCard doc={latestBook} media="books" />}
								</div>
								<div className=" w-full my-4">
									<h3 className="mx-auto mb-4 text-center">Movie</h3>
									{latestMovie && <HomeCard doc={latestMovie} media="movies" />}
								</div>
								<div className=" w-full my-4">
									<h3 className="mx-auto mb-4 text-center">TV</h3>
									{latestTv && <HomeCard doc={latestTv} media="tv" />}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
