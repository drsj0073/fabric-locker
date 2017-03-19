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

			// Possibly need a reference here?
		dbRef.update({
			brand: this.brandText.value,
			type: this.typeText.value,
 			amount: this.amountNumber.value,
			width: this.widthNumber.value,
			care: this.careText.value
		});

		this.setState({
			edit: false
		});
	}

	render() {
		let editCard = (
			<div>
				<h3>{this.props.data.brand}</h3> 
				<h3>{this.props.data.type}</h3>
				<h3>{this.props.data.amount}</h3>
				<h3>{this.props.data.width}</h3>
				<h3>{this.props.data.care}</h3>
			</div>
		)

		if (this.state.edit) {
			editCard = (
				<form onSubmit={this.saveChanges}>
					
					<input type="text" default={this.props.card.brand} name="brand" ref={ref => this.brandText = ref} />

					<input type="text" default={this.props.card.type} name="type" ref={ref => this.typeText = ref} />

					<input type="number" default={this.props.card.amount} name="amount" ref={ref => this.amountNumber = ref} />

					<input type="number" default={this.props.card.number} name="width" ref={ref => this.widthNumber = ref} />

					<input type="text" default={this.props.card.care} name="care" ref={ref => this.careText = ref} />
					

					<input type="submit" value="done editing!" />
				</form>
			)
		}


		return (
			<div>
				<i className="fa fa-edit" onClick={() => this.setState({edit: true})}></i>

				<i className="fa fa-times" onClick={() => this.props.removeCard(this.props.card.key)}></i>

				{editCard}
			</div>
		)
	}
}