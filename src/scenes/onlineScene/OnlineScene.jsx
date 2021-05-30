import { Scene } from '../Scene.jsx';
const React = require('react');
const ReactDOM = require('react-dom');

export class MenuScene extends Scene {
	constructor(game) {
		super();
		this.game = game;
	}

	render(root) {
		ReactDOM.render(<p>online scene</p>, root);
	}
}