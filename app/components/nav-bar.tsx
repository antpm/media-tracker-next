"use client";

import { useState, useEffect } from "react";
import { HomeIcon, GameIcon, BookIcon, AccountIcon, LogOutIcon, NavClose, NavOpen } from "../public/icons/icons";
import Link from "next/link";
import Image from "next/image";
import { auth } from "../util/firebase/firebase-app";
import { onAuthStateChanged } from "firebase/auth";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(auth.currentUser);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            
        });

        return () => unsubscribe();
    }, []);

    function changeMenu() {
        setIsOpen(!isOpen);
    }

    const links = [
        { name: "Home", icon: HomeIcon, path: "/" },
        { name: "Games", icon: GameIcon, path: "/games" },
        { name: "Books", icon: BookIcon, path: "/books" },
        { name: "Account", icon: AccountIcon, path: "/account" },
        { name: "Logout", icon: LogOutIcon, path: "/logout" },
    ]

    return (
        <div className="w-48">
            {currentUser && <div className="h-full w-fit fixed flex flex-col bg-purple-800 shadow-2xl shadow-black">
                <button className="mr-2 ml-auto flex flex-row border-b-2 border-purple-950 w-full place-content-end bg-purple-900" onClick={changeMenu}>
                    {isOpen ? (
                        <Image className="w-16 h-16" src={NavClose} alt="" />
                    ) : (
                        <Image className="w-16 h-16" src={NavOpen} alt="" />
                    )}
                </button>
                <div className="flex flex-col mx-4 my-10 place-content-start">
                    {links.map((link) => {
                        return (
                            <Link key={link.name} href={link.path} className="m-2 flex flex-row items-center">
                                <Image src={link.icon} alt="" className="" />
                                {isOpen && <p className="ml-2 text-xl text-white">{link.name}</p>}
                            </Link>
                        )
                    })}
                </div>
            </div>}
            
        </div>
    );
}