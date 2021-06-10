import { pathToFileURL } from 'url';
import { AudioManager } from './managers/audioManager.jsx';
import { MenuScene } from './scenes/menuScene/MenuScene.jsx';
const { SkeldjsClient } = require('@skeldjs/client');
const { authTokenHook } = require('@skeldjs/get-auth-token');
const fs = require('fs');
const path = require('path');

export class App {
	constructor(root) {
		this.root = root;
	}

	init(fps, clientVersion, appDataDirPath) {
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
		this.client = new SkeldjsClient(clientVersion);
		this.appDataPath = appDataDirPath;
		console.log(path.join(process.resourcesPath, 'binaries/GetAuthToken.exe'));
		authTokenHook(this.client, {
			exe_path: path.join(process.resourcesPath, 'binaries/GetAuthToken.exe'),
			cert_path: '',
		});
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
