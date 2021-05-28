import { Scene } from './Scene.jsx';
const React = require('react');
const ReactDOM = require('react-dom');

export class MenuScene extends Scene {
	constructor(root) {
		super();
		this.root = root;
	}

	init() {
		this.buttons = {};
		this.buttons.online = <button className='button is-primary' id='online'>Online</button>;
		this.buttons.yes = <button className='button is-primary' id='yes'>Yes</button>;
	}

	render() {
		ReactDOM.render(<div className='scene' id='menuScene'>{Object.values(this.buttons)}</div>, this.root);
	}
}