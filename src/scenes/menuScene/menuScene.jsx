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
		this.game.audioManager.addSound('main_menu', 'menu_music.mp3', 'music', true);
		this.buttons = {};
		this.buttons.online = <button className='button is-primary menuScene' id='onlineButton' onClick={() => {
			this.game.audioManager.addSound('click', 'general_sounds/UI_Select.wav', 'ui', false);

			this.game.setScene(OnlineScene);
		}} onMouseEnter={() => this.game.audioManager.addSound('hover', 'general_sounds/UI_Hover.wav', 'ui', false)}>Online</button>;
	}

	render(root) {
		ReactDOM.render(<div id='menuScene' className='scene'>{Object.values(this.buttons)}</div>, root);
	}
}
