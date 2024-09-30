"use client";

import { auth, db, collections } from "./util/firebase/firebase-app";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, orderBy, limit, QueryDocumentSnapshot } from "firebase/firestore";
import { useState, useEffect, MouseEventHandler } from "react";
import { useRouter } from "next/navigation";
import { HomeGameCard } from "./components/cards/game-card";


export default function Home() {

    const [currentUser, setCurrentUser] = useState(auth.currentUser);
    const router = useRouter();

    const [latestGame, setLatestGame] = useState<QueryDocumentSnapshot>();
    const [waiting, setWaiting] = useState(true);


    async function getData() {
        const gameRef = collection(db, collections.users, currentUser!.uid, collections.games);
        const latestGameQuery = query(gameRef, orderBy("complete"), limit(1));
        const querySnap = await getDocs(latestGameQuery);

        setLatestGame(querySnap.docs[0]);
        setWaiting(false);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        if (!currentUser) {
            router.push("/login");
        } else {
            console.log("data getted");
            getData();
        }

        return () => unsubscribe();
    }, []);

    return (
        <>
            {currentUser &&
                <div className="flex flex-col h-full">
                    <div className="mx-auto my-4 text-2xl">Welcome {currentUser!.displayName}</div>
                    <div className="my-4 w-10/12 h-full mx-auto flex flex-row flex-wrap justify-center gap-10">
                        {!waiting && <HomeGameCard gameDoc={latestGame!} />}
                        {!waiting && <HomeGameCard gameDoc={latestGame!} />}
                    </div>
                </div>

            }
        </>
    );



}
