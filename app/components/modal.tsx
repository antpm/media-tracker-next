import { MouseEventHandler, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type props = {
	modalState: Boolean;
	modalToggle: Function;
	saveFunction: MouseEventHandler;
	media: string;
	mode: string;
};

export default function Modal({ modalState, modalToggle, saveFunction, media, mode }: props) {
	const [title, setTitle] = useState('');
	const [genre, setGenre] = useState('');
	const [platform, setPlatform] = useState('');
	const [develoer, setDeveloper] = useState('');
	const [rating, setRating] = useState(1);
	const [complete, SetComplete] = useState(new Date());
	const [image, setImage] = useState<File | null>(null);
	//in order to get the file input to reset when the modal closes, it is assigned a key which gets changed on close, causing it to be re-rendered
	const [imageKey, setImageKey] = useState(Date());

	function saveForm() {
		console.log(`Title: ${title}\nDeveloper: ${develoer}\nPlatform: ${platform}\nGenere: ${genre}\nRating: ${rating}\nComplete: ${complete}\nImage: ${image?.name}`);
		close();
	}

	function clear() {
		setTitle('');
		setGenre('');
		setDeveloper('');
		setPlatform('');
		setImage(null);
		setImageKey(Date());
	}

	function close() {
		clear();
		modalToggle(false);
	}

	return (
		<>
			<div onClick={close} id="modal-bg" className={`${modalState ? 'block' : 'hidden'} modal-background fixed inset-x-0 inset-y-0 z-40`}></div>
			<div id="modal" className={`${modalState ? 'flex flex-col' : 'hidden'} lg:w-1/4 w-4/5 h-fit fixed inset-x-0 inset-y-0 m-auto items-center bg-gray-800 rounded-xl z-50 p-4`}>
				<h1 className="mx-auto">
					{mode} {media}
				</h1>

				<form className="flex flex-col my-auto w-3/4">
					<label>Title:</label>
					<input
						type="text"
						className="text-black mb-4"
						onChange={(e) => {
							setTitle(e.target.value);
						}}
						value={title}
						placeholder="Title"
					/>

					<label>Developer:</label>
					<input
						type="text"
						className="text-black mb-4"
						onChange={(e) => {
							setDeveloper(e.target.value);
						}}
						value={develoer}
						placeholder="Developer"
					/>

					<label>Platform:</label>
					<input
						type="text"
						className="text-black mb-4"
						onChange={(e) => {
							setPlatform(e.target.value);
						}}
						value={platform}
						placeholder="Platform"
					/>

					<label>Genre:</label>
					<input
						type="text"
						className="text-black mb-4"
						onChange={(e) => {
							setGenre(e.target.value);
						}}
						value={genre}
						placeholder="Genre"
					/>

					<label>Rating:</label>
					<select
						className="w-16 text-black mb-4"
						value={rating}
						onChange={(e) => {
							setRating(Number(e.target.value));
						}}
					>
						<option className="text-end text-black" value={1}>
							1
						</option>
						<option className="text-end text-black" value={2}>
							2
						</option>
						<option className="text-end text-black" value={3}>
							3
						</option>
						<option className="text-end text-black" value={4}>
							4
						</option>
						<option className="text-end text-black" value={5}>
							5
						</option>
					</select>
					<label>Completion Date:</label>
					<DatePicker selected={complete} onChange={(date) => SetComplete(date!)} className="text-black mb-4" />
					<label>Image:</label>
					<input
						type="file"
						accept="image/*"
						key={imageKey}
						onChange={(e) => {
							setImage(e.target.files ? e.target.files[0] : null);
						}}
					/>
				</form>
				<div className="flex flex-row justify-evenly w-full mt-4">
					<button onClick={saveForm} className="bg-gray-500">
						Save {media}
					</button>
					<button onClick={close} className=" bg-gray-500">
						Cancel
					</button>
				</div>
			</div>
		</>
	);
}
