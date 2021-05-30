/* eslint-disable react/prop-types */
const React = require('react');
import { OnlineScene } from '../onlineScene/OnlineScene.jsx';

export class OnlineButton extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.props.game.setScene(new OnlineScene(this.props.game), false);
	}

	render() {
		return <button onClick={this.handleClick} className={this.props.class} id={this.props.id}>{this.props.text}</button>;
	}
}