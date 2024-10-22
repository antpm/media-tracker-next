'use client';
import { auth } from '../util/firebase/firebase-app';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Account() {
	const [displayName, setDisplayName] = useState<string | null>('');
	const [oldPassword, setOldPassword] = useState<string>('');
	const [newPassword, setNewPassword] = useState<string>('');

	const router = useRouter();

	function sleep(time: number) {
		return new Promise((resolve) => setTimeout(resolve, time));
	}

	useEffect(() => {
		if (!auth.currentUser) {
			//in my testing, a sleep as low as 140 allows users to refresh the page without getting routed to login
			sleep(1000).then(() => {
				auth.currentUser ? setDisplayName(auth.currentUser.displayName) : router.push('/login', { scroll: false });
			});
		} else {
			setDisplayName(auth.currentUser.displayName);
		}

		/* const unsubscribe = onAuthStateChanged(auth, (user) => {
			console.log('authstatechangeuser: ', user);
			setCurrentUser(user);
		});

		return () => unsubscribe(); */
	}, []);

	return (
		<section title="Account" className="flex flex-col md:w-fit w-full h-fit mx-auto my-10 gap-8">
			<h1 className="mx-auto">Account Management</h1>
			<div className="w-full card p-4 flex flex-col gap-4 shadow-lg shadow-black">
				<h4 className="mx-auto">Display Name</h4>
				<input
					className="w-2/3 mx-auto rounded-sm text-black"
					type="text"
					placeholder="Display Name"
					value={displayName ? displayName : ''}
					onChange={(e) => {
						setDisplayName(e.target.value);
					}}
				/>
				<button className="button w-2/3 mx-auto shadow-md shadow-black transition-color duration-500 ease-in-out"> Change Display Name</button>
			</div>
			<div className="w-full card p-4 flex flex-col gap-4 shadow-lg shadow-black">
				<h4 className="mx-auto">Password</h4>
				<input
					title="Enter Old Password"
					type="password"
					placeholder="Old Password"
					className="w-2/3 mx-auto rounded-sm text-black"
					value={oldPassword}
					onChange={(e) => {
						setOldPassword(e.target.value);
					}}
				/>
				<input
					title="Enter New Password"
					type="password"
					placeholder="New Password"
					className="w-2/3 mx-auto rounded-sm text-black"
					value={newPassword}
					onChange={(e) => {
						setNewPassword(e.target.value);
					}}
				/>
				<button className="button w-2/3 mx-auto shadow-lg shadow-black transition-color duration-300 ease-in-out"> Change Password</button>
			</div>
			<button className="button-danger shadow-lg shadow-black mt-8 transition-color duration-300 ease-in-out">Delete Account</button>
		</section>
	);
}
