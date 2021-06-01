import { AudioManager } from './managers/audioManager.jsx';
import { MenuScene } from './scenes/menuScene/MenuScene.jsx';

export class Game {
	constructor(root) {
		this.root = root;
	}

	init(fps) {
		// Create config object
		this.config = {
			sound: {
				ui: 0.3,
				game: 1,
				music: 0.7,
			},
			graphics: {
				fps,
			},
		};
		// Set audio manager
		this.audioManager = new AudioManager(this);
		this._currentScene = new MenuScene(this);
		this._currentScene.init();
		this._currentPopup = null;
		this.renderer = setInterval(() => {
			this._currentScene.render(this.root);
		}, 1000 / fps);
	}

	setScene(Scene, shouldInit) {
		this._currentScene = new Scene(this);
		if(shouldInit) this._currentScene.init();
	}
}
