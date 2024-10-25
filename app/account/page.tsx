'use client';
import { auth, db } from '../util/firebase/firebase-app';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential, signInWithEmailAndPassword, updatePassword, updateProfile } from 'firebase/auth';
import ModalWrapper from '../components/modal-wrapper';
import { doc, setDoc } from 'firebase/firestore';

export default function Account() {
	const [displayName, setDisplayName] = useState<string | null>('');
	const [oldPassword, setOldPassword] = useState<string>('');
	const [newPassword, setNewPassword] = useState<string>('');
	const [nameError, setNameError] = useState<Boolean>(false);
	const [nameErrorMsg, setNameErrorMsg] = useState<string>('');
	const [passError, setPassError] = useState<Boolean>(false);
	const [passErrorMsg, setPassErrorMsg] = useState<string>('');
	const [success, setSuccess] = useState<Boolean>(false);
	const [successMsg, setSuccessMsg] = useState<string>('');
	const [modal, setModal] = useState<Boolean>(false);
	const [confirm, setConfirm] = useState<Boolean>(false);
	const [deletePass, setDeletePass] = useState<string>('');
	const [deleteError, setDeleteError] = useState<Boolean>(false);
	const [deleted, setDeleted] = useState<Boolean>(false);
	const router = useRouter();

	function toggleModal() {
		setModal(!modal);
		setDeleteError(false);
		setConfirm(false);
		setDeletePass('');
	}

	async function deleteAccount() {
		setDeleteError(false);
		if (deletePass === '') {
			setDeleteError(true);
		} else {
			const credential = EmailAuthProvider.credential(auth.currentUser!.email!, deletePass);
			await reauthenticateWithCredential(auth.currentUser!, credential)
				.then(async () => {
					const userRef = doc(db, 'users', auth.currentUser!.uid);
					await setDoc(userRef, { deleted: true }, { merge: true })
						.then(async () => {
							deleteUser(auth.currentUser!)
								.then(async () => {
									setDeleted(true);
									await sleep(5000).then(() => {
										router.push('/login');
									});
								})
								.catch((error) => {
									console.log(error);
								});
						})
						.catch((error) => {
							console.log(error);
						});
				})
				.catch((error) => {
					setDeleteError(true);
				});
		}
	}

	function sleep(time: number) {
		return new Promise((resolve) => setTimeout(resolve, time));
	}

	useEffect(() => {
		if (!auth.currentUser) {
			sleep(1000).then(() => {
				auth.currentUser ? setDisplayName(auth.currentUser.displayName) : router.push('/login', { scroll: false });
			});
		} else {
			setDisplayName(auth.currentUser.displayName);
		}
	}, []);

	async function changeDisplayName() {
		setNameError(false);
		if (displayName === '') {
			setNameError(true);
			setNameErrorMsg('Display name cannot be blank');
		} else if (displayName === auth.currentUser!.displayName) {
			setNameError(true);
			setNameErrorMsg('Display name was not changed');
		} else {
			await updateProfile(auth.currentUser!, { displayName: displayName }).then(async () => {
				setSuccessMsg('Display Name Updated');
				setSuccess(true);
				await sleep(5000).then(() => {
					setSuccess(false);
				});
			});
		}
	}

	async function changePassword() {
		setPassError(false);
		if (oldPassword === '' || newPassword === '') {
			setPassError(true);
			setPassErrorMsg('Password cannot be blank');
		} else {
			const credential = EmailAuthProvider.credential(auth.currentUser!.email!, oldPassword);
			await reauthenticateWithCredential(auth.currentUser!, credential)
				.then(async () => {
					await updatePassword(auth.currentUser!, newPassword)
						.then(async () => {
							setSuccessMsg('Password Updated');
							setSuccess(true);
							setOldPassword('');
							setNewPassword('');
							await sleep(5000).then(() => {
								setSuccess(false);
							});
						})
						.catch((error) => {
							switch (error.code) {
								case 'auth/weak-password':
									setPassError(true);
									setPassErrorMsg('Password too weak');
									break;
							}
						});
				})
				.catch((error) => {
					setPassErrorMsg('Current Password Incorrect');
					setPassError(true);
				});
		}
	}

	return (
		<>
			<ModalWrapper modalState={modal} modalToggle={toggleModal}>
				{!confirm ? (
					<>
						<h4>Are you sure you wish to delete your account?</h4>
						<h4>This action cannot be undone.</h4>
						<div className="mt-10">
							<button
								className="button-danger mr-4 transition-all duration-500 ease-in-out"
								onClick={() => {
									setConfirm(true);
								}}>
								Yes
							</button>
							<button className="button ml-4 transition-all duration-500 ease-in-out" onClick={toggleModal}>
								Cancel
							</button>
						</div>
					</>
				) : (
					<>
						{deleted ? (
							<h4 className="my-10">Your account has been deleted. You will now be redirected to the login screen. Goodbye.</h4>
						) : (
							<>
								<h4 className="mb-10">Please re-enter your password to confirm deletion</h4>

								<div className="w-1/2 mb-10">
									{deleteError && <p className="text-red-600 animate-pulse mx-auto font-bold">Incorrect Password</p>}
									<input
										type="password"
										placeholder="Password"
										className="text-black rounded-sm w-full"
										value={deletePass}
										onChange={(e) => {
											setDeletePass(e.target.value);
										}}
									/>
								</div>

								<div>
									<button className="button-danger mr-4 transition-all duration-500 ease-in-out" onClick={deleteAccount}>
										Delete Account
									</button>
									<button className="button ml-4 transition-all duration-500 ease-in-out" onClick={toggleModal}>
										Cancel
									</button>
								</div>
							</>
						)}
					</>
				)}
			</ModalWrapper>
			{success && <div className="fixed top-0 w-screen inset-x-0 bg-green-600 h-fit text-center text-3xl animate-pulse z-50">{successMsg}</div>}
			{auth.currentUser && (
				<section title="Account" className="flex flex-col md:w-fit w-full h-fit mx-auto my-10 gap-8">
					<h1 className="mx-auto">Account Management</h1>
					<div className="w-full card p-4 flex flex-col gap-4 shadow-lg shadow-black">
						<h4 className="mx-auto">Display Name</h4>
						{nameError && <p className="text-red-600 animate-pulse w-2/3 mx-auto font-bold">{nameErrorMsg}</p>}
						<input
							className="w-2/3 mx-auto rounded-sm text-black"
							type="text"
							placeholder="Display Name"
							value={displayName ? displayName : ''}
							onChange={(e) => {
								setDisplayName(e.target.value);
							}}
						/>
						<button className="button w-2/3 mx-auto shadow-md shadow-black transition-color duration-500 ease-in-out" onClick={changeDisplayName}>
							Change Display Name
						</button>
					</div>
					<div className="w-full card p-4 flex flex-col gap-4 shadow-lg shadow-black">
						<h4 className="mx-auto">Password</h4>
						{passError && <p className="text-red-600 animate-pulse w-2/3 mx-auto font-bold">{passErrorMsg}</p>}
						<input
							title="Enter Current Password"
							type="password"
							placeholder="Current Password"
							className="w-2/3 mx-auto rounded-sm text-black"
							value={oldPassword}
							onChange={(e) => {
								setOldPassword(e.target.value);
							}}
						/>
						<input
							title="Enter New Password"
							type="password"
							placeholder="New Password"
							className="w-2/3 mx-auto rounded-sm text-black"
							value={newPassword}
							onChange={(e) => {
								setNewPassword(e.target.value);
							}}
						/>
						<button className="button w-2/3 mx-auto shadow-lg shadow-black transition-color duration-300 ease-in-out" onClick={changePassword}>
							Change Password
						</button>
					</div>
					<button className="button-danger shadow-lg shadow-black mt-8 transition-color duration-300 ease-in-out" onClick={toggleModal}>
						Delete Account
					</button>
				</section>
			)}
		</>
	);
}
