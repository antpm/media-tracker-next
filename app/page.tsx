"use client";

import { auth } from "./util/firebase/firebase-app";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect, MouseEventHandler } from "react";


export default function Home() {

    const [currentUser, setCurrentUser] = useState(auth.currentUser);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        return () => unsubscribe();
    }, []);

    function logOut() {
        auth.signOut();
        setCurrentUser(null);
    }

    async function handleLogin() {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setCurrentUser(userCredential.user);
            //navigate("/");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            {!currentUser && <div className="flex flex-col w-full h-full">
                <div className="flex flex-col w-fit m-auto">
                    <h1>Log In</h1>
                    <input className="text-black" type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input className="text-black" type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit" onClick={handleLogin}>Submit</button>
                </div>

            </div>}
            {currentUser && 
            <div className="flex flex-col">
                <div>Welcome {currentUser.displayName}</div>
                <button onClick={logOut} >Sign Out</button>
            </div>
            
            }
            
        </div>

    );
}
