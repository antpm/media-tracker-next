"use client";

import { useState, useEffect } from "react";
import { auth } from "../util/firebase/firebase-app";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Login() {
    const [currentUser, setCurrentUser] = useState(auth.currentUser);
    console.log("login screen currentUser: ", currentUser);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            console.log("authState change user: ", user);
            if(user){
                router.push("/");
            }
        });
        
        return () => unsubscribe();
    }, []);

    /* useEffect(()=>{
        if (currentUser){
            router.push("/");
        }
    }, [currentUser]); */

    async function handleLogin() {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setCurrentUser(userCredential.user);
            router.push("/");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="w-full h-full">
            {!currentUser && <div className="flex flex-col w-full h-full">
            <div className="flex flex-col w-fit m-auto">
                <h1>Log In</h1>
                <input className="text-black" type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="text-black" type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" onClick={handleLogin}>Submit</button>
            </div>
        </div>}
        </div>
        
    )
}