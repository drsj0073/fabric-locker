import React from 'react';
import ReactDOM from 'react-dom';
// Component imports
import Header from './components/header.js';
import FabricCard from './components/fabricCard.js';


  // Initialize Firebase
  const config = {
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
			items: [],
			brand: "",
			type: "",
			amount: "",
			width: "",
			care: ""
		}

		this.showMainForm = this.showMainForm.bind(this);
		this.addToCard = this.addToCard.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.photo = this.photo.bind(this);
	}

	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
			console.log("userrr", user);
			if(user) {
				firebase.database().ref().on('value', (res) => {
					const userData = res.val();
					const dataArray = [];
					for (let objKey in userData) {
						userData[objKey].key = objKey;
						dataArray.push(userData[objKey])
					}
					this.setState ({
						items: dataArray
					});
				});
			}
		});

	}

	// ********** Main Form ***********

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}
	showMainForm(e) {
		e.preventDefault();
		console.log('hi!');
		//this.mainForm.classList.toggle("showMainForm")
	}

	// Delete a Card

	removeCard(fabricCardId) {
		const dbRef = firebase.database().ref(fabricCardId);
		dbRef.remove();
	}

	// Add a Card

	addToCard(e) {
		e.preventDefault();
		const items = {
			brand: this.state.brand,
			type: this.state.type,
 			amount: this.state.amount,
			width: this.state.width,
			care: this.state.care,
			photo: this.state.photo
		}
		const dbRef = firebase.database().ref();
		dbRef.push(items)

		this.setState({
			brand: '',
			type: '',
			amount: '',
			width: '',
			care: '',
			
		})
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


	render() {

		return (
			<div>
				<Header />
				<section>
					<div className="fabric-form__container">
						<h2 className="section-title">Enter Your Fabric</h2>
						<form className="fabric-form" onSubmit={this.addToCard}>
						    <input type="text" placeholder="Enter a Brand" name="brand" value={this.state.brand} onChange={this.handleChange}/>

						   	<input type="text" placeholder="Enter a Type" name="type" value={this.state.type} onChange={this.handleChange}/>
						  	
						   	<input type="number" placeholder="Enter an Amount" name="amount" value={this.state.amount} onChange={this.handleChange} />

						    <input type="number" placeholder="Enter a Width" name="width" value={this.state.width} onChange={this.handleChange}/>
						  
						    <input type="text" name="care" placeholder="Enter Care Instructions" value={this.state.care} onChange={this.handleChange} />

						  
						    <input type='file' accept='image/*' id='filebutton' onChange={this.photo} />

						  <input type="submit" className="btn btn--pink" value="Add a Fabric" onSubmit={this.addToCard} />
						</form>
					</div>

				</section>

				<div>
					{this.state.items.map((item, i) => {
						return <FabricCard data={item} key={`item-${i}`} removeCard={this.removeCard} />
					})}
				</div>
			</div>	
		)
	}
}

ReactDOM.render(<App />, document.getElementById('app'));