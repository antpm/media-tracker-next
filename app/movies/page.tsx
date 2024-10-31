'use client';
import { useEffect, useState } from 'react';
import { auth } from '../util/firebase/firebase-app';
import { useRouter } from 'next/navigation';
import MediaList from '../components/media-list';

export default function Movies() {
	const router = useRouter();
	const [user, setUser] = useState(auth.currentUser);

	function sleep(time: number) {
		return new Promise((resolve) => setTimeout(resolve, time));
	}

	useEffect(() => {
		//firebase's auth persistance has a delay on re-authenticating the user, so we check if auth has a currentUser and if not we wait 1 second and check again
		//if auth still doesn't have a currentUser after the wait, we push to login
		//without the sleep, users would get routed to login when navigating to this page using the address bar or refreshing
		//then login would route them to home since firebase would have re-authenticated by the time the page loads
		//there is probably a better way to handle this
		if (!auth.currentUser) {
			//in my testing, a sleep as low as 140 allows users to refresh the page without getting routed to login
			sleep(1000).then(() => {
				auth.currentUser ? setUser(auth.currentUser) : router.push('/login', { scroll: false });
			});
		} else {
			setUser(auth.currentUser);
		}

		/* const unsubscribe = onAuthStateChanged(auth, (user) => {
			console.log('authstatechangeuser: ', user);
			setCurrentUser(user);
		});

		return () => unsubscribe(); */
	}, []);

	return (
		<div className="flex flex-col my-10">
			<h1 className="mx-auto">Movies</h1>
			{user ? <MediaList media="movies" /> : <div>Loading...</div>}
		</div>
	);
}
