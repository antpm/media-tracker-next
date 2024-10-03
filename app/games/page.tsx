'use client';
import { useState } from 'react';

export default function Games() {
	const [modal, setModal] = useState(false);

	function toggleModal() {
		setModal(!modal);
		console.log(modal);
	}

	return (
		<>
			<div id="modal-container" className={`${modal ? 'flex flex-col' : 'hidden'} modal-background fixed inset-x-0 inset-y-0 m-auto bg-gray-600 items-center`}>
				<div id="modal" className="w-96 h-96 flex flex-col m-auto items-center bg-gray-800 rounded-xl justify-center">
					<p>This will be my modal for my add/edit stuff</p>
					<button onClick={toggleModal} className=" bg-gray-500">
						Close modal
					</button>
				</div>
			</div>
			<div className="w-full h-full flex flex-col">
				<button onClick={toggleModal} className="bg-gray-500 m-auto">
					Open Modal
				</button>
			</div>
		</>
	);
}
