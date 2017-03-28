import React from 'react';
import ReactDOM from 'react-dom';
import FabricCard from './components/fabricCard';

 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDw2WtTPY0BiO7ay3LVddM-4sErmub8HK0",
    authDomain: "fabric-locker.firebaseapp.com",
    databaseURL: "https://fabric-locker.firebaseio.com",
    storageBucket: "fabric-locker.appspot.com",
    messagingSenderId: "335409976142"
  };
  firebase.initializeApp(config);

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			fabrics: [],
			loggedin: false
		}
		this.showSideBar = this.showSideBar.bind(this);
		this.addFabric = this.addFabric.bind(this);
		this.removeFabric = this.removeFabric.bind(this);
		this.showCreate = this.showCreate.bind(this);
		this.createUser = this.createUser.bind(this);
		this.showLogin = this.showLogin.bind(this);
		this.loginUser = this.loginUser.bind(this);
		this.photo = this.photo.bind(this);
	}

	componentDidMount() {
		firebase.auth().onAuthStateChanged((user)=> {
			if (user) {
				firebase.database().ref(`users/${user.uid}/fabrics`)
				.on('value',(res) => {
				const userData = res.val();
				const dataArray = [];
				for (let objectKey in userData) {
					userData[objectKey].key = objectKey;
					dataArray.push(userData[objectKey])
				}
				this.setState({
					fabrics: dataArray,
					loggedin: true
				})
			});
		}
		else{
			this.setState({
				fabrics:[],
				loggedin: false
			})
		}
	})
}			

	showSideBar(e) {
		e.preventDefault(); 
		this.sidebar.classList.toggle("show");
	}

	addFabric(e) {
		e.preventDefault(); 
		const fabric = {
			brand: this.brandTitle.value,
			type: this.fabricType.value,
			amount: this.amountText.value,
			width: this.widthText.value,
			care: this.careText.value,
			photo: this.state.photo
		};
		
		const userId = firebase.auth().currentUser.uid;
		const dbRef = firebase.database().ref(`users/${userId}/fabrics`);

		dbRef.push(fabric);

		this.brandTitle.value = "";
		this.fabricType.value = "";
		this.amountText.value = "";
		this.widthText.value = "";
		this.careText.value = "";
		this.fabricPhoto.value = "";
		this.showSideBar(e);
	}

	photo(e) {
        let file = e.target.files[0];
        let storageRef = firebase.storage().ref('images/' + file.name);
        let task = storageRef.put(file)
        .then(() => {
            let urlObject = storageRef.getDownloadURL().then((data) => {
                this.setState ({
                    photo: data
                })
            })
        });
    }

	removeFabric(fabricId) {
		const userId = firebase.auth().currentUser.uid;
		const dbRef = firebase.database().ref(`users/${userId}/fabrics/${fabricId}`);
		dbRef.remove();
		console.log("whaaaaa");
	}

	showCreate(e) {
		e.preventDefault();
		this.overlay.classList.toggle('show');
		this.signup.classList.toggle('show');
	}

	createUser(e) {
		e.preventDefault();
		const email = this.createEmail.value;
		const password =this.createPassword.value;
		const confirm =this.confirmPassword.value;
		if(password === confirm) {
			firebase.auth()
				.createUserWithEmailAndPassword(email, password)
				.then((res) => {
					this.showCreate(e);
				})
				.catch((err) => {
					alert(err.message)
				})

		}
		else {
			alert("Passwords must Match")
		}
	}

	showLogin(e) {
		e.preventDefault();
		this.overlay.classList.toggle("show");
		this.login.classList.toggle("show");
	}

	loginUser(e) {
		e.preventDefault();
		const email = this.userEmail.value;
		const password =this.userPassword.value;

		firebase.auth()
			.signInWithEmailAndPassword(email, password)
			.then((res)=> {
				this.showLogin(e);
			})
			.catch((err) => {
				alert(err.message);
			});
	}

	logOut() {
		firebase.auth().signOut();
	}

	renderCards() {
		if(this.state.loggedin) {
			return this.state.fabrics.map((fabric,i) => {
				return (
					<FabricCard fabric={fabric} key={`fabric-${i}`} removeFabric={this.removeFabric} />
				)
			}).reverse();
		} 
		else {
			return (
				<div>
					<h2>Login to add a fabric!</h2>
				</div>
			);
		}
	}	

	render() {
	return (
			<div>
				<header className="header">
					<h1>Fabric Locker</h1>
					<nav>
						{
							(() => {
								if(this.state.loggedin) {
									return (
										<span>
											<a href="" onClick={this.showSideBar} className="header__link">Add New Fabric</a>
											<a href="" onClick={this.logOut} className="header__link">Logout</a>
										</span>	
									)	
								}
								else {
									return (
										<span>
											<a href="" onClick={this.showCreate} className="header__link"> Create Account</a>
											<a href="" onClick={this.showLogin} className="header__link">Login</a>
										</span>	
									)
								}
							})()	
						}						
					</nav>
				</header>
				<div className="overlay" ref={ref => this.overlay = ref}></div>

				<section className="fabrics">
					{this.renderCards()}
				</section>


				<aside className="fabric-box" ref={ref => this.sidebar = ref}>
					<form onSubmit={this.addFabric}> 
						<h3 className="fabric-box__title">Add New Fabric</h3>
						<div className="close-btn" onClick={this.showSideBar}>
							<i className="fa fa-times modal__exit"></i>
						</div>
						
						<input type="text" name="brand-title" placeholder="Brand:" ref={ref => this.brandTitle = ref}/>

						<input type="text" name="fabric-type" placeholder="Type:" ref={ref => this.fabricType = ref}/>

						<input type="text" name="amount-text" placeholder="Amount:" ref={ref => this.amountText = ref}/>

						<input type="text" name="width-text" placeholder="Width" ref={ref => this.widthText = ref}/>

						<input type="text" name="care-text" placeholder="Care Instructions:" ref={ref => this.careText = ref}/>

						 <input type='file' accept='image/*' id='filebutton' onChange={this.photo} ref={ref => this.fabricPhoto = ref} className="form__photo"/>


						<input type="submit" value="Add New Fabric" className="modal__button"/>
					</form>
				</aside>

				<div className="login modal" ref={ref => this.login = ref}>
					<div className="close" onClick={this.showLogin}>
						<i className="fa fa-times modal__exit"></i>
					</div>
					<form action="" onSubmit={this.loginUser}>
						<div className="modal__form">
							<input type="text" className="modal__input" name="email" placeholder="Email:" ref={ref => this.userEmail = ref}/>
						</div>
						<div className="modal__form">
							<input type="password" className="modal__input" name="password" placeholder="Password:" ref={ref => this.userPassword =ref}/>
						</div>
						<div className="modal__form">
							<input type="submit" value="Login" className="modal__button"/>
						</div>
					</form>
				</div>

				<div className="signup modal" ref={ref => this.signup = ref}>
					<div className="close" onClick={this.showCreate}>
						<i className="fa fa-times modal__exit"></i>
					</div>
					<form action="" onSubmit={this.createUser}>
						<div className="modal__form">
							<input type="text" name="createEmail" className="modal__input" placeholder="Email:" ref={ref => this.createEmail = ref}/>
						</div>
						<div className="modal__form">
							<input type="password" name="createPassword" className="modal__input" placeholder="Create Password:" ref={ref => this.createPassword = ref}/>
						</div>
						<div className="modal__form">
							<input type="password" name="confirmPassword" className="modal__input" placeholder="Confirm Password:" ref={ref => this.confirmPassword = ref}/>
						</div>
						<div className="modal__form">
							<input type="submit" value="Create Account" className="modal__button"/>
						</div>
					</form>
				</div>

			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('app'));