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
		if( this.state.formToShow === 'createUser nav__link-item' ) {
			loginForm = (
			<div className="userForm__container">
				<h2 className="section-title">Create An Account</h2>
				<form onSubmit={this.createUser} className="userForm"> 

				 	<input type="email" placeholder="Enter Your Email" name="createEmail" onChange={this.handleChange} ref={ref => this.createEmail = ref}/>

			 	 	<input type="password" name="createPassword" placeholder="Enter Your Password"  onChange={this.handleChange} ref={ref => this.createPassword = ref}/>

			 	 	<input type="password" name="confirmPassword" placeholder="Confirm Your Email"  onChange={this.handleChange} ref={ref => this.confirmPassword = ref}/>

			 	 	<button className="btn btn--pink">Sign Up</button>
				</form>
			</div>
			);
		} else if( this.state.formToShow === 'loginUser nav__link-item' ) {
			loginForm = (
			<div className="userForm__container">
				<h2 className="section-title">Login</h2>

				<form onSubmit={this.loginUser} className="userForm"> 

				 	<input type="email" placeholder="Enter Your Email" name="email" onChange={this.handleChange} ref={ref => this.userEmail = ref}  />

			 	 	<input type="password" placeholder="Enter Your Password" name="password" onChange={this.handleChange} ref={ref => this.userPassword = ref} />
			 	 	<button className="btn btn--pink">Sign In</button>
				</form>
			</div>
			);
		}

		return (
			<div>
				<header className="main-header">
					<h2 className="main-header__logo">Fabric Locker</h2>
					<nav>
						<ul className='nav'>
							<li><a href='' className="nav__link-item" onClick={this.showMainForm}>Add Fabric</a></li>
							<li><a href='' className="createUser nav__link-item" onClick={this.formToShow}> Create Account</a></li>
							<li><a href='' className="loginUser nav__link-item" onClick={this.formToShow}> Sign In</a></li>
							<li><a href='' className="signOut nav__link-item" onClick={this.signOut}> Sign Out</a></li>
						</ul>
					</nav>
				</header>
				{loginForm}
			</div>	
		)
	}
}



