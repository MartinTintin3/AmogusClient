import { Scene } from '../Scene.jsx';
import { OnlineButton } from './OnlineButton.jsx';
const React = require('react');
const ReactDOM = require('react-dom');

export class MenuScene extends Scene {
	constructor(game) {
		super(game);
		this.game = game;
	}

	init() {
		this.buttons = {};
		this.buttons.online = <OnlineButton class='button is-primary' id='onlineButton' text='Online' game={this.game}/>;
	}

	render(root) {
		ReactDOM.render(<div className='scene' id='menuScene'>{Object.values(this.buttons)}</div>, root);
	}
}