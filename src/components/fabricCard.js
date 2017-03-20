import React from 'react';

export default class FabricCard extends React.Component {
	constructor() {
		super();
		this.state = {
			edit: false,
			card: {}
		};
		this.saveChanges = this.saveChanges.bind(this);
	}

	saveChanges(e) {
		e.preventDefault();
		const dbRef = firebase.database().ref(this.props.data.key);

		dbRef.update({
			brand: this.brandText.value,
			type: this.typeText.value,
 			amount: this.amountNumber.value,
			width: this.widthNumber.value,
			care: this.careText.value
		});

		this.setState({
			editing: false
		});
	}

	render() {
		let editCard = (
			<form>
				<h3>{this.props.data.brand}</h3> 
				<h3>{this.props.data.type}</h3>
				<h3>{this.props.data.amount}</h3>
				<h3>{this.props.data.width}</h3>
				<h3>{this.props.data.care}</h3>
			</form>
		)

		if (this.state.editing) {
			editCard = (
				<form onSubmit={this.saveChanges}>
					
					<input type="text" defaultValue={this.props.data.brand} name="brand" ref={ref => this.brandText = ref} />

					<input type="text" defaultValue={this.props.data.type} name="type" ref={ref => this.typeText = ref} />

					<input type="number" defaultValue={this.props.data.amount} name="amount" ref={ref => this.amountNumber = ref} />

					<input type="number" defaultValue={this.props.data.number} name="width" ref={ref => this.widthNumber = ref} />

					<input type="text" defaultValue={this.props.data.care} name="care" ref={ref => this.careText = ref} />


					<input type="submit" value="done editing!" />
				</form>
			)
		}


		return (
			<div>
				<i className="fa fa-edit" onClick={() => this.setState({editing: true})}></i>

				<i className="fa fa-times" onClick={() => this.props.removeCard(this.props.data.key)}></i>

				{editCard}
				<img className="cardPhoto" src={`${this.props.data.photo}`} />
			</div>
		)
	}
}