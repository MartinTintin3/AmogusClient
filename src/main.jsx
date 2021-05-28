const { remote } = require('electron');
const path = require('path');
const { MenuScene } = require('./scenes/MenuScene.jsx');

console.log(remote.getCurrentWebContents().getTitle());
const fs = remote.require('fs');

let currentScene = new MenuScene(document.getElementById('root'));

require('./bulma.scss');

const getAppDataPath = () => {
	switch (process.platform) {
	case 'darwin':
		return path.join(process.env.HOME, 'Library', 'Application Support', 'amogusclient');
	case 'win32':
		return path.join(process.env.APPDATA, 'amogusclient');
	case 'linux':
		return path.join(process.env.HOME, '.amogusclient');
	default:
		console.log('Unsupported platform!');
		process.exit(1);
	}
};

const appDataDirPath = getAppDataPath();

if (!fs.existsSync(appDataDirPath)) {
	fs.mkdirSync(appDataDirPath);
}

if(!fs.existsSync(path.join(appDataDirPath, 'servers.json'))) {
	const data = {
		currentlySelected: 0,
		servers: [
			{
				name: 'North America',
				host: 'na.mm.among.us',
				port: '22023',
			},
			{
				name: 'Europe',
				host: 'eu.mm.among.us',
				port: '22023',
			},
			{
				name: 'Asia',
				host: 'as.mm.among.us',
				port: '22023',
			},
		],
	};

	fs.writeFileSync(path.join(appDataDirPath, 'servers.json'), JSON.stringify(data), () => {
		process.exit(1);
	});

	console.log(fs.readFileSync(path.join(appDataDirPath, 'servers.json')).toString());
}

currentScene.init();

setInterval(() => currentScene.render(), 1000 / 30);