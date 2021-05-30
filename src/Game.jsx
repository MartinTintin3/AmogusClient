import { MenuScene } from './scenes/menuScene/MenuScene';

export class Game {
	constructor(root) {
		this.root = root;
	}

	init() {
		this._currentScene = new MenuScene(this);
		this._currentPopup = null;
		this.renderer = setInterval(() => {
			this._currentScene.render();
		}, 1000 / 30);
	}

	setScene(Scene, shouldInit) {
		this._currentScene = new Scene();
		if(shouldInit) this._currentScene.init();
	}
}