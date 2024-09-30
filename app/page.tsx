"use client";

import { auth } from "./util/firebase/firebase-app";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect, MouseEventHandler } from "react";
import { useRouter } from "next/navigation";


export default function Home() {

    const [currentUser, setCurrentUser] = useState(auth.currentUser);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        if (!currentUser) {
            router.push("/login");
        }

        return () => unsubscribe();
    }, []);

    function logOut() {
        auth.signOut();
        setCurrentUser(null);
        router.push("/login");
    }


    return (
        <>
            {currentUser &&
                <div className="flex flex-col">
                    <div>Welcome {currentUser!.displayName}</div>
                </div>
            }
        </>
    );



}
