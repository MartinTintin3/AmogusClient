// Imports
const path = require('path');
import { App } from './app.jsx';
const fs = require('fs');

// Set the scene manager
const app = new App(document.getElementsByTagName('body')[0]);

// Import custom bulma
require('./bulma.scss');

// Funtion to get application data folder
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

// Create servers.js if needed
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

app.init(30, '2021.6.30', appDataDirPath);