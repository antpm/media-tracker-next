import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, getFirestore, orderBy, query, QuerySnapshot, addDoc, doc, setDoc, Timestamp, where, Query } from 'firebase/firestore';
import { getStorage, uploadBytes, ref } from 'firebase/storage';
import { firebaseConfig } from './config';

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

interface Snapshots {
	games: QuerySnapshot;
	books: QuerySnapshot;
	movies: QuerySnapshot;
	tv: QuerySnapshot;
}

export async function getDocuments(userID: string, table: string, sort: string, year: number): Promise<QuerySnapshot> {
	const startDate = Timestamp.fromDate(new Date(year, 0, 1));
	const endDate = Timestamp.fromDate(new Date(year, 11, 31));
	const ref = collection(db, 'users', userID, table);
	const q = query(ref, where('complete', '>=', startDate), where('complete', '<=', endDate), orderBy(sort, 'desc'));
	const querySnap = await getDocs(q);
	console.log(querySnap.docs[0]);

	return querySnap;
}

export async function getAllDocuments(userID: string, year: number): Promise<Snapshots> {
	const tables = ['games', 'books', 'movies', 'tv'];
	const startDate = Timestamp.fromDate(new Date(year, 0, 1));
	const endDate = Timestamp.fromDate(new Date(year, 11, 31));
	const querySnaps: QuerySnapshot[] = [];
	/* tables.forEach(async (table) => {
		const ref = collection(db, 'users', userID, table);
		const q = query(ref, where('complete', '>=', startDate), where('complete', '<=', endDate), orderBy('complete', 'desc'));
		const snap = await getDocs(q);
		console.log(snap.docs[0]);
		querySnaps.push(snap);
	}); */
	const gameSnap = console.log(querySnaps);
	const snapshots: Snapshots = { games: querySnaps[0], books: querySnaps[1], movies: querySnaps[2], tv: querySnaps[3] };
	console.log(snapshots);
	return snapshots;
}

export async function addDocument(userID: string, table: string, docData: {}, imageName: string, image: File | null) {
	const fsRef = collection(db, 'users', userID, table);
	await addDoc(fsRef, docData);

	const storageRef = ref(storage, `/images/${table}/${imageName}`);
	if (image != null) {
		await uploadBytes(storageRef, image);
	}
}

export async function editDocument(userID: string, table: string, docData: {}, docID: string, imageName: string, image: File | null) {
	const fsRef = doc(db, 'users', userID, table, docID);
	await setDoc(fsRef, docData);

	const storageRef = ref(storage, `/images/${table}/${imageName}`);
	if (image != null) {
		await uploadBytes(storageRef, image);
	}
}

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function generateImageName(length: number) {
	let result = '';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return result;
}
