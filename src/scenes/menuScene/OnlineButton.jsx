/* eslint-disable react/prop-types */
const React = require('react');
import { OnlineScene } from '../onlineScene/OnlineScene.jsx';

export class OnlineButton extends React.Component {
	onclick() {
		this.props.game.setScene(OnlineScene, false);
	}

	render() {
		return <button onClient={this.onclick} className={this.props.class} id={this.props.id}>{this.props.text}</button>;
	}
}