import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, getFirestore, orderBy, query, QuerySnapshot, addDoc, doc, setDoc } from 'firebase/firestore';
import { getStorage, uploadBytes, ref } from 'firebase/storage';
import { firebaseConfig } from './config';

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

export async function getDocuments(userID: string, table: string, sort: string): Promise<QuerySnapshot> {
	const ref = collection(db, 'users', userID, table);
	const q = query(ref, orderBy(sort, 'desc'));
	const querySnap = await getDocs(q);

	return querySnap;
}

export async function addDocument(userID: string, table: string, docData: {}, imageName: string, image: File | null) {
	const fsRef = collection(db, 'users', userID, table);
	await addDoc(fsRef, docData)
		.then(() => {
			//console.log('doc added');
		})
		.catch((error) => {
			//console.log('Error: ', error.message);
		});

	const storageRef = ref(storage, `/images/${table}/${imageName}`);
	if (image != null) {
		await uploadBytes(storageRef, image)
			.then(() => {
				//console.log('image uploaded');
			})
			.catch((error) => {
				//console.log('Error: ', error.message);
			});
	}
}

export async function editDocument(userID: string, table: string, docData: {}, docID: string, imageName: string, image: File | null) {
	const fsRef = doc(db, 'users', userID, table, docID);
	await setDoc(fsRef, docData)
		.then(() => {
			//console.log('doc edited');
		})
		.catch((error) => {
			//console.log('Error: ', error.message);
		});

	const storageRef = ref(storage, `/images/${table}/${imageName}`);
	if (image != null) {
		await uploadBytes(storageRef, image)
			.then(() => {
				//console.log('image uploaded');
			})
			.catch((error) => {
				//console.log('Error: ', error.message);
			});
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
