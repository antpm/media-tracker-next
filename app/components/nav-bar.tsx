'use client';

import { useState, useEffect } from 'react';
import { HomeIcon, GameIcon, BookIcon, AccountIcon, LogOutIcon, NavClose, NavOpen } from '../public/icons/icons';
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
        router.push('/login');
    }

    const links = [
        { name: 'Home', icon: HomeIcon, path: '/' },
        { name: 'Games', icon: GameIcon, path: '/games' },
        { name: 'Books', icon: BookIcon, path: '/books' },
    ];

    return (
        <>
            {currentUser && (
                <div className="w-48">
                    <div className="h-full w-fit fixed flex flex-col bg-purple-800 shadow-2xl shadow-black">
                        <button className="mr-2 ml-auto flex flex-row border-b-2 border-purple-950 w-full place-content-end bg-purple-900" onClick={changeMenu}>
                            {isOpen ? <Image className="w-16 h-16" src={NavClose} alt="" /> : <Image className="w-16 h-16" src={NavOpen} alt="" />}
                        </button>
                        <div className="flex flex-col h-full mx-4 my-10 place-content-start">
                            {links.map((link) => {
                                return (
                                    <Link key={link.name} href={link.path} className="m-2 flex flex-row items-center">
                                        <Image src={link.icon} alt="" className="" />
                                        {isOpen && <p className="ml-2 text-xl text-white">{link.name}</p>}
                                    </Link>
                                );
                            })}
                        </div>
                        <div className="flex flex-col h-fit mx-4 mb-4 place-content-start border-t-2 border-purple-900">
                            <Link className="m-2 flex flex-row items-center" href={'/account'}>
                                <Image src={AccountIcon} alt="" />
                                {isOpen && <p className="ml-2 text-xl text-white">Account</p>}
                            </Link>
                            <button className="m-2 flex flex-row items-center" onClick={logOut}>
                                <Image src={LogOutIcon} alt="" />
                                {isOpen && <p className="ml-2 text-xl text-white">Log Out</p>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
