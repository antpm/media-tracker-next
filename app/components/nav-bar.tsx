'use client';

import { useState, useEffect } from 'react';
import { HomeIcon, GameIcon, BookIcon, AccountIcon, LogOutIcon, NavClose, NavOpen, Logo, Menu } from '../public/icons/icons';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '../util/firebase/firebase-app';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [currentUser, setCurrentUser] = useState(auth.currentUser);
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user);
		});

		return () => unsubscribe();
	}, []);

	function changeMenu() {
		setIsOpen(!isOpen);
	}

	function logOut() {
		auth.signOut();
		setCurrentUser(null);
		router.push('/login', { scroll: false });
	}

	const links = [
		{ name: 'Home', icon: HomeIcon, path: '/' },
		{ name: 'Games', icon: GameIcon, path: '/games' },
		{ name: 'Books', icon: BookIcon, path: '/books' },
	];

	return (
		<>
			{currentUser && (
				<div className="z-30">
					<div id="desktop-nav" className="hidden fixed lg:flex w-48 h-screen flex-col nav-bg border-r-2 border-stone-800">
						<div className="p-4 flex flex-row items-center border-b-2 primary-bg  border-stone-800">
							<Image src={Logo} alt="logo" width={48} height={48} />
							<p className="ml-2">Media Tracker</p>
						</div>
						{/* this button opened and closed the desktop menu, which I decided to get rid of
                        <button className="mr-2 ml-auto flex flex-row border-b-2 border-purple-950 w-full place-content-end" onClick={changeMenu}>
								{isOpen ? <Image className="w-16 h-16" src={NavClose} alt="" /> : <Image className="w-16 h-16" src={NavOpen} alt="" />}
							</button> */}
						<div className={`flex flex-col h-full my-10 place-content-start`}>
							{links.map((link) => {
								return (
									<Link key={link.name} href={link.path} className="my-2 flex flex-row items-center w-full">
										<Image src={link.icon} alt="" className={`ml-8`} />
										<p className=" ml-2 text-xl text-white">{link.name}</p>
									</Link>
								);
							})}
						</div>
						<div className="flex flex-col h-56 place-content-start border-t-2 border-stone-800 primary-bg">
							<Link className="my-2 flex flex-row items-center w-full" href={'/account'}>
								<Image src={AccountIcon} alt="" className="ml-6" />
								<p className="ml-2 text-xl text-white">Account</p>
							</Link>
							<button className="my-2 flex flex-row items-center w-full" onClick={logOut}>
								<Image src={LogOutIcon} alt="" className="ml-6" />
								<p className="ml-2 text-xl text-white">Log Out</p>
							</button>
						</div>
					</div>
					<div id="mobile-nav" className="h-fit flex flex-col fixed w-full lg:hidden items-center ">
						<div className="w-full flex flex-row items-center primary-bg">
							<Image src={Logo} alt="logo" width={48} height={48} />
							<p className="ml-2 text-2xl flex-grow">Media Tracker</p>
							<button onClick={changeMenu}>
								<Image src={Menu} alt="menu" />
							</button>
						</div>
						<div className={`${isOpen ? 'block' : 'hidden'} columns-1 w-full h-fit nav-bg divide-y-2 divide-stone-800 justify-start`}>
							{links.map((link) => {
								return (
									<Link key={link.name} onClick={changeMenu} href={link.path} className="my-2 mx-auto flex flex-row items-center justify-center">
										<p className=" ml-2 text-xl text-white">{link.name}</p>
									</Link>
								);
							})}
							<Link href={'/account'} onClick={changeMenu} className="my-2 mx-auto flex flex-row items-center justify-center">
								<p className=" ml-2 text-xl text-white">Account</p>
							</Link>
							<button onClick={logOut} className="my-2 w-full mx-auto flex flex-row items-center justify-center">
								<p className=" ml-2 text-xl text-white">Log Out</p>
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
