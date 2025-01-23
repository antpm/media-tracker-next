'use client';

import { auth, getAllDocuments, getDocuments } from '../util/firebase/firebase-app';
import { onAuthStateChanged } from 'firebase/auth';
import { QueryDocumentSnapshot, QuerySnapshot, Timestamp } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StatCard from '../components/stat-card';
import Games from '../games/page';

export default function Stats() {
	const [currentUser, setCurrentUser] = useState(auth.currentUser);
	const router = useRouter();

	const [gameSnap, setGameSnap] = useState<QuerySnapshot>();
	const [bookSnap, setBookSnap] = useState<QuerySnapshot>();
	const [movieSnap, setMovieSnap] = useState<QuerySnapshot>();
	const [tvSnap, setTvSnap] = useState<QuerySnapshot>();

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
				<div title="Stats Page" className="flex flex-col my-10 max-w-full">
					<h1 className="mx-auto mb-8">Stats</h1>
					<div title="Your Stats" className="flex flex-col md:w-3/4 w-full rounded-xl mx-auto my-10 p-4">
						{!waiting && (
							<div className=" gap-8 flex flex-col">
								{!gameSnap?.empty && (
									<div>
										<h3 className="text-center my-4">Games</h3>
										<div className="flex-col flex card shadow-md shadow-black">
											<StatCard snapshot={gameSnap!} />
										</div>
									</div>
								)}
								{!bookSnap?.empty && (
									<div>
										<h3 className="text-center my-4">Books</h3>
										<div className="flex-col flex card shadow-md shadow-black">
											<StatCard snapshot={bookSnap!} />
										</div>
									</div>
								)}
								{!movieSnap?.empty && (
									<div>
										<h3 className="text-center my-4">Movies</h3>
										<div className="flex-col flex card shadow-md shadow-black">
											<StatCard snapshot={movieSnap!} />
										</div>
									</div>
								)}
								{!tvSnap?.empty && (
									<div>
										<h3 className="text-center my-4">TV</h3>
										<div className="flex-col flex card shadow-md shadow-black">
											<StatCard snapshot={tvSnap!} />
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
}
