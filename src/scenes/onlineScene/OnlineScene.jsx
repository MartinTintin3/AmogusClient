import { Scene } from '../Scene.jsx';
const React = require('react');
const ReactDOM = require('react-dom');

export class OnlineScene extends Scene {
	constructor(game) {
		super(game);
		this.game = game;
	}

	render(root) {
		ReactDOM.render(<p>online scene</p>, root);
	}
}