'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { auth } from '../util/firebase/firebase-app';
import { signInWithEmailAndPassword, onAuthStateChanged, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '../public/icons/icons';

export default function Login() {
	const [currentUser, setCurrentUser] = useState(auth.currentUser);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [remember, setRemember] = useState(false);
	const [errors, setErrors] = useState(false);
	const [errorsMsg, setErrorsMsg] = useState('');
	const [authWait, setAuthWait] = useState(true);
	const router = useRouter();

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
		if (!auth.currentUser) {
			sleep(1000).then(() => {
				auth.currentUser ? router.push('/', { scroll: false }) : setAuthWait(false);
			});
		}
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
				remember ? auth.setPersistence(browserLocalPersistence) : auth.setPersistence(browserSessionPersistence);
				const userCredential = await signInWithEmailAndPassword(auth, email, password);
				setCurrentUser(userCredential.user);
				router.push('/', { scroll: false });
			} catch (error) {
				console.log(error);
				setErrors(true);
				setErrorsMsg('Email/Password incorrect');
			}
		}
	}

	return (
		<div className=" fixed w-screen h-screen inset-x-0 inset-y-0">
			{errors && <div className="fixed top-0 w-full bg-red-600 h-fit text-center text-3xl">{errorsMsg}</div>}
			<div className="fixed top-12 text-3xl inset-x-0">
				<div className="mx-auto w-fit flex flex-row items-center">
					<Image src={Logo} width={96} alt="logo" />
					<p>Media Tracker</p>
				</div>
			</div>
			{!currentUser && !authWait ? (
				<div className="flex w-full h-full items-center justify-center">
					<div className="flex card flex-col p-2">
						<h1 className="mx-auto m-4 text-2xl">Log In</h1>
						<p className="mx-2">Email*:</p>
						<input className="text-black mx-2 mb-2" type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
						<p className="mx-2">Password*:</p>
						<input className="text-black mx-2 mb-2" type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
						<div className="flex mx-auto items-center">
							<input className="test-black mx-2" type="checkbox" checked={remember} onChange={() => setRemember(!remember)} />
							Remember me
						</div>
						<button className="button transition-all duration-500 ease-in-out w-fit mx-auto my-4" type="submit" onClick={handleLogin}>
							Submit
						</button>
						<Link href={{ pathname: '/signup', query: { preAuth: true } }} className="text-white underline mb-4">
							Don't have an account? Click here to sign up!
						</Link>
					</div>
				</div>
			) : (
				<div className="flex w-full h-full items-center justify-center">
					<div className="loader"></div>
				</div>
			)}
		</div>
	);
}
