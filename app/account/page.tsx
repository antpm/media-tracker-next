export default function Account() {
	return (
		<section title="Account" className="flex flex-col md:w-fit w-full h-fit mx-auto my-10 gap-8">
			<h1 className="mx-auto">Account Management</h1>
			<div className="w-full card p-2 flex flex-col gap-4">
				<h4 className="mx-auto">Display Name</h4>
				<input className="w-2/3 mx-auto rounded-sm" type="text" placeholder="Display Name" />
				<button className="button w-2/3 mx-auto"> Change Display Name</button>
			</div>
			<div className="w-full card p-2 flex flex-col gap-4">
				<h4 className="mx-auto">Password</h4>
				<input type="password" placeholder="Current Password" className="w-2/3 mx-auto rounded-sm" />
				<input type="password" placeholder="New Password" className="w-2/3 mx-auto rounded-sm" />
				<button className="button w-2/3 mx-auto"> Change Password</button>
			</div>
			<button className="button-danger">Delete Account</button>
		</section>
	);
}
