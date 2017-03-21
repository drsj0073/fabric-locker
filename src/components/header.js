import React from 'react';

export default class Header extends React.Component {
	constructor() {
		super();
		this.state = {
			formToShow: '',
			email: '',
			password: '',
			confirm: ''
		};
		this.formToShow = this.formToShow.bind(this);
		this.createUser = this.createUser.bind(this);
		this.loginUser = this.loginUser.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.signOut = this.signOut.bind(this);
	}

	formToShow(e) {
		e.preventDefault();
		this.setState({
			formToShow: e.target.className
		})
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	signOut(e) {
		e.preventDefault();
		firebase.auth().signOut().then(function() {
		  console.log('Signed Out');
		}, function(error) {
		  console.error('Sign Out Error', error);
		});
	}


	// ********** Create Account Form ***********

	createUser(e) {
		e.preventDefault();

		const email = this.createEmail.value;
		const password = this.createPassword.value;
		const confirm = this.confirmPassword.value;


		this.createEmail.value = "";
		this.createPassword.value = "";
		this.confirmPassword.value = "";

		if (password === confirm) {
			firebase.auth()
			.createUserWithEmailAndPassword(email, password)
			.then((data) => {
				console.log(data);
			})
			.catch((error) => {
				console.log(error.code)
				console.log(error.message)
			})

		} 
	}

	// ********** Login Form ***********

	loginUser(e) {
		e.preventDefault();
		const email = this.userEmail.value;
		const password = this.userPassword.value;

		this.userEmail.value = '';
		this.userPassword.value = '';


		firebase.auth()
		.signInWithEmailAndPassword(this.state.email, this.state.password)
		.then((data) => {
				console.log(data);
			});
		
	}

	render() {
		let loginForm = '';
		if( this.state.formToShow === 'createUser' ) {
			loginForm = (
			<div>
				<form onSubmit={this.createUser} className="userForm"> 
					<h2>Create Account</h2>

					<label htmlFor="createEmail">Email:</label>
				 	<input type="email" name="createEmail" onChange={this.handleChange} />

			 		<label htmlFor="createPassword">Password:</label>
			 	 	<input type="password" name="createPassword" onChange={this.handleChange} />

			 	 	<label htmlFor="confirmPassword">Confirm Password:</label>
			 	 	<input type="password" name="confirmPassword" onChange={this.handleChange} />

			 	 	<button>Sign Up</button>
				</form>
			</div>
			);
		} else if( this.state.formToShow === 'loginUser' ) {
			loginForm = (
			<div>
				<form onSubmit={this.loginUser} className="userForm"> 
					<h2>Sign In</h2>
					<label htmlFor="email">Email:</label>
				 	<input type="email" name="email" onChange={this.handleChange} ref={ref => this.userEmail = ref}  />

			 		<label htmlFor="password">Password:</label>
			 	 	<input type="password" name="password" onChange={this.handleChange} ref={ref => this.userPassword = ref} />
			 	 	<button>Sign In</button>
				</form>
			</div>
			);
		}

		return (
			<div>
				<header>
					<h2>Fabric Locker</h2>
					<nav>
						<ul>
							<li><a href='' onClick={this.showMainForm}>Add Fabric</a></li>
							<li><a href='' className="createUser" onClick={this.formToShow}> Create Account</a></li>
							<li><a href='' className="loginUser" onClick={this.formToShow}> Sign In</a></li>
							<li><a href='' className="signOut" onClick={this.signOut}> Sign Out</a></li>
						</ul>
					</nav>
				</header>
				{loginForm}
			</div>	
		)
	}
}



