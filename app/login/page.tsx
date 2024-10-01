'use client';

import { useState, useEffect } from 'react';
import { auth } from '../util/firebase/firebase-app';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Login() {
	const [currentUser, setCurrentUser] = useState(auth.currentUser);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState(false);
	const [errorsMsg, setErrorsMsg] = useState('');
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user);
			user && router.push('/');
		});
		return () => unsubscribe();
	}, []);

	async function handleLogin() {
		setErrors(false);
		setErrorsMsg('');
		if (email === '' || password === '') {
			console.log('vaidation failed');
			setErrors(true);
			setErrorsMsg('All fields are required');
		} else {
			try {
				const userCredential = await signInWithEmailAndPassword(auth, email, password);
				setCurrentUser(userCredential.user);
				router.push('/');
			} catch (error) {
				console.log(error);
				setErrors(true);
				setErrorsMsg('Email/Password incorrect');
			}
		}
	}

	return (
		<>
			{errors && <div className="fixed top-0 w-full bg-red-600 h-fit text-center text-3xl">{errorsMsg}</div>}
			{!currentUser && (
				<div className="flex w-full h-full items-center justify-center">
					<div className="flex flex-col bg-slate-600 rounded-lg">
						<h1 className="mx-auto m-4 text-2xl">Log In</h1>
						<p className="mx-2">Email*:</p>
						<input className="text-black mx-2" type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
						<p className="mx-2">Password*:</p>
						<input className="text-black mx-2" type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
						<button className="m-4 bg-purple-600 w-fit mx-auto p-1 rounded-lg border-2" type="submit" onClick={handleLogin}>
							Submit
						</button>
					</div>
				</div>
			)}
		</>
	);
}
