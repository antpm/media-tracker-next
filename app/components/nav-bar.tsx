'use client';

import { useState, useEffect } from 'react';
import { HomeIcon, GameIcon, BookIcon, AccountIcon, LogOutIcon, Logo, Menu, MovieIcon, TVIcon, StatIcon } from '@/public/icons/icons';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '../util/firebase/firebase-app';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [currentUser, setCurrentUser] = useState(auth.currentUser);
	const router = useRouter();
	const pathname = usePathname();
	const isActive = (url: string) => pathname === url;

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
		{ name: 'Movies', icon: MovieIcon, path: '/movies' },
		{ name: 'TV', icon: TVIcon, path: '/tv' },
		{ name: 'Stats', icon: StatIcon, path: '/stats' },
	];

	return (
		<>
			{currentUser && (
				<div className="z-30">
					<div id="desktop-nav" className="hidden fixed lg:flex w-48 h-screen flex-col secondary-bg shadow-2xl shadow-black nav-main-border">
						<div className="p-4 flex flex-row items-center primary-bg  border-stone-800">
							<Image src={Logo} alt="logo" width={48} height={48} />
							<p className="ml-2">Media Tracker</p>
						</div>

						<div className={`flex flex-col h-full py-10 place-content-start  nav-menu-border `}>
							{links.map((link) => {
								return (
									<Link
										key={link.name}
										href={link.path}
										className={`${
											isActive(link.path) && 'scale-125 pointer-events-none'
										} my-2 flex flex-row items-center w-full  hover:bg-violet-900 transition-all duration-200 ease-in-out rounded-3xl`}>
										<Image src={link.icon} alt="" className={`ml-8`} />
										<p className=" ml-2 text-xl text-white">{link.name}</p>
									</Link>
								);
							})}
						</div>
						<div className="flex flex-col h-56 place-content-start primary-bg nav-main-border">
							<Link
								className={`${
									isActive('/account') && 'scale-125 pointer-events-none'
								} my-2 flex flex-row items-center w-full  hover:bg-violet-950 rounded-3xl transition-all duration-200 ease-in-out`}
								href={'/account'}>
								<Image src={AccountIcon} alt="" className="ml-6" />
								<p className="ml-2 text-xl text-white">Account</p>
							</Link>
							<button className="my-2 flex flex-row items-center w-full hover:bg-violet-950 rounded-3xl transition-all duration-200 ease-in-out" onClick={logOut}>
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
