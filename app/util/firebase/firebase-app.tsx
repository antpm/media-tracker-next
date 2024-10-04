import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, getFirestore, orderBy, query, QuerySnapshot } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export const collections = { users: 'users', games: 'games', books: 'books' };

export async function getGames(userID: string): Promise<QuerySnapshot> {
	const gameRef = collection(db, collections.users, userID, collections.games);
	const latestGameQuery = query(gameRef, orderBy('complete', 'desc'));
	const gameQuerySnap = await getDocs(latestGameQuery);
	return gameQuerySnap;
}

export async function getBooks(userID: string): Promise<QuerySnapshot> {
	const bookRef = collection(db, collections.users, userID, collections.books);
	const latestBookQuery = query(bookRef, orderBy('complete', 'desc'));
	const bookQuerySnap = await getDocs(latestBookQuery);
	return bookQuerySnap;
}
