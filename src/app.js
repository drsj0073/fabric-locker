import React from 'react';
import ReactDOM from 'react-dom';
// Component imports
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
			amount: 0,
			width: 0,
			care: ""
		}
		this.showMainForm = this.showMainForm.bind(this);
		this.addToCard = this.addToCard.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
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

	removeCard(fabricCardId) {
		const dbRef = firebase.database().ref(fabricCardId);
		dbRef.remove();
		console.log("bye!");
	}

	addToCard(e) {
		e.preventDefault();
		const items = {
			brand: this.state.brand,
			type: this.state.type,
 			amount: this.state.amount,
			width: this.state.width,
			care: this.state.care
		}
		const dbRef = firebase.database().ref();
		dbRef.push(items)
	}


	render() {
		return (
			<div>
				<header>
					<h2>Fabric Locker</h2>
					<nav>
						<a href='#' onClick={this.showMainForm}><i className="fa fa-plus-circle" aria-hidden="true"></i>Add Fabric</a>
					</nav>
				</header>
				<section>
					<form className="mainForm" onSubmit={this.addToCard}>
					  	<label htmlFor="brand">Brand:</label>
					    <input type="text" name="brand" ref={ref => this.brandText = ref} value={this.state.brand} onChange={this.handleChange}/>

					  	<label htmlFor="type">Type:</label>
					   	<input type="text" ref={ref => this.typeText = ref} name="type" value={this.state.type} onChange={this.handleChange}/>
					  	
					  	<label htmlFor="amount">Amount:</label>
					   	<input type="number" ref={ref => this.amountNumber = ref} name="amount" value={this.state.amount} onChange={this.handleChange} />

					 	<label htmlFor="width">Width:</label>
					    <input type="number" ref={ref => this.widthNumber = ref} name="width" value={this.state.width} onChange={this.handleChange}/>
					  
					  	<label htmlFor="care">Care Instructions:</label>
					    <textarea name="care" ref={ref => this.careText = ref} value={this.state.care} onChange={this.handleChange}></textarea>

					  <input type="submit" value="Add a Fabric" onSubmit={this.addToCard} />
					</form>
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