'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '../util/firebase/firebase-app';
import { useRouter, useSearchParams } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

export default function SignUp() {
	const [currentUser, setCurrentUser] = useState(auth.currentUser);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPass, setConfirmPass] = useState('');
	const [displayName, setDisplayName] = useState('');
	const [errors, setErrors] = useState(false);
	const [errorsMsg, setErrorsMsg] = useState('');
	const [success, setSuccess] = useState(false);
	const [authWait, setAuthWait] = useState(true);
	const router = useRouter();
	const searchParams = useSearchParams();

	function sleep(time: number) {
		return new Promise((resolve) => setTimeout(resolve, time));
	}

	/* useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user);
			user && router.push('/', { scroll: false });
		});
		return () => unsubscribe();
	}, []); */

	useEffect(() => {
		const preAuth = searchParams.get('preAuth');
		if (!auth.currentUser && !preAuth) {
			sleep(1000).then(() => {
				auth.currentUser ? router.push('/', { scroll: false }) : setAuthWait(false);
			});
		} else {
			setAuthWait(false);
		}
	}, []);

	async function handleSignUp() {
		setErrors(false);
		setErrorsMsg('');
		if (email === '' || password === '' || confirmPass === '' || displayName === '') {
			//console.log('vaidation failed');
			setErrors(true);
			setErrorsMsg('All fields are required');
		} else if (password != confirmPass) {
			setErrors(true);
			setErrorsMsg('Passwords do not match');
		} else {
			await createUserWithEmailAndPassword(auth, email, password)
				.then((userCred) => {
					setDoc(doc(db, 'users', userCred.user.uid), {
						join: Timestamp.fromDate(new Date()),
					});
					updateProfile(auth.currentUser!, { displayName: displayName });
					auth.signOut();
					setCurrentUser(userCred.user);
					setSuccess(true);
					sleep(5000).then(() => {
						router.push('/login');
					});
				})
				.catch((error: FirebaseError) => {
					//console.log(error.code);
					switch (error.code) {
						case 'auth/invalid-email':
							setErrorsMsg('Invalid Email');
							break;
						case 'auth/email-already-in-use':
							setErrorsMsg('An account is already registered to this Email');
							break;
						case 'auth/weak-password':
							setErrorsMsg('Password too weak');
							break;
					}

					setErrors(true);
				});
		}
	}
	return (
		<div className=" fixed w-screen h-screen inset-x-0 inset-y-0 bg z-50">
			{errors && <div className="fixed top-0 w-full bg-red-600 h-fit text-center text-3xl">{errorsMsg}</div>}
			{success && (
				<div className="flex w-full h-full items-center justify-center">
					<div className="flex flex-col bg-slate-600 rounded-lg p-2 animate-pulse">
						<h1 className="mx-auto m-4 text-2xl">Success!</h1>
						<p className="mx-2">You will be returned to the Log In screen shortly...</p>
					</div>
				</div>
			)}
			{!currentUser && !authWait && (
				<div className="flex w-full h-full items-center justify-center">
					<div className="flex card flex-col p-2">
						<h1 className="mx-auto m-4 text-2xl">Sign Up</h1>
						<p className="mx-2">Email*:</p>
						<input className="text-black mx-2 mb-2" type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
						<p className="mx-2">Display Name*:</p>
						<input className="text-black mx-2 mb-2" type="email" placeholder="email" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
						<p className="mx-2">Password*:</p>
						<input className="text-black mx-2 mb-2" type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
						<p className="mx-2">Confirm Password*:</p>
						<input className="text-black mx-2 mb-2" type="password" placeholder="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />

						<button className="m-4 button transition-all duration-500 ease-in-out w-fit mx-auto my-4 " type="submit" onClick={handleSignUp}>
							Submit
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
