import { OnlineScene } from '../onlineScene/OnlineScene.jsx';
import { Scene } from '../Scene.jsx';
const React = require('react');
const ReactDOM = require('react-dom');

export class MenuScene extends Scene {
	constructor(game) {
		super(game);
		this.game = game;
	}

	init() {
		this.buttons = {};
		this.buttons.online = <button className='button is-primary' id='onlineButton' onClick={() => this.game.setScene(OnlineScene)}>Online</button>;
	}

	render(root) {
		ReactDOM.render(<div className='scene' id='menuScene'>{Object.values(this.buttons)}</div>, root);
	}
}
