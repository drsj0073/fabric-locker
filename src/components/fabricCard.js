import React from 'react';

export default class FabricCard extends React.Component {
	constructor() {
		super();
		this.state = {
			editing: false,
			fabric: {}
		};
		this.save = this.save.bind(this);
	}
	save(e) {
		e.preventDefault();
		
		const userId = firebase.auth().currentUser.uid;
		const dbRef = firebase.database().ref(`users/${userId}/fabrics/${this.props.fabric.key}`);

		dbRef.update({
			brand: this.brandTitle.value,
			type: this.fabricType.value,
 			amount: this.amountText.value,
			width: this.widthText.value,
			care: this.careText.value
		});

		this.setState({
			editing: false
		});
	}

	render() {
		let editingTemp = (
			<span>
				<h4>{this.props.fabric.brand}</h4>
				<p><span className="fabricCard__heading">Type:</span> {this.props.fabric.type}</p>
				<p><span className="fabricCard__heading">Amount:</span>  {this.props.fabric.amount}</p>
				<p><span className="fabricCard__heading">Width:</span> {this.props.fabric.width}</p>
				<p><span className="fabricCard__heading">Care:</span>  {this.props.fabric.care}</p>
			</span>
		)
		if(this.state.editing) {
			editingTemp = (
				<form onSubmit={this.save}>
					<div className="modal__form">
						<input type="text" defaultValue={this.props.fabric.brand} className="modal__input" name="brand-title" ref={ref => this.brandTitle = ref}/>
					</div>
					<div className="modal__form">
						<input type="text" defaultValue={this.props.fabric.type} className="modal__input" name="fabric-type" ref={ref => this.fabricType = ref}/>
 					</div>
 					<div className="modal__form">
						<input type="text" defaultValue={this.props.fabric.amount} className="modal__input" name="amount-text" ref={ref => this.amountText = ref}/>
					</div>
					<div className="modal__form">
						<input type="text" defaultValue={this.props.fabric.width} className="modal__input" name="width-text" ref={ref => this.widthText = ref}/>
					</div>
					<div className="modal__form">
						<input type="text" defaultValue={this.props.fabric.care} className="modal__input" name="care-text" ref={ref => this.careText = ref}/>
					</div>
						<input type="submit" value="Done editing!" className="modal__button"/>
				</form>
			)
		}
		return (
			<div className="fabricCard">
				<i className="fa fa-edit" onClick={() => this.setState({editing: true})}></i>
				<i className="fa fa-times" onClick={() => this.props.removeFabric(this.props.fabric.key)}></i>
				{editingTemp}
				<img className="fabricPhoto" src={`${this.props.fabric.photo}`} />
			</div>
		)
	}
}