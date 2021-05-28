const { app, BrowserWindow, Menu, MenuItem, screen, remote } = require('electron');
const path = require('path');

function createWindow() {

	const win = new BrowserWindow({
		width: 640,
		height: 400,
		webPreferences: {
			devTools: true,
			webSecurity: true,
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true,
		},
	});

	win.setAspectRatio(16 / 10);

	win.loadURL(`file://${__dirname}/index.html`);

	let correctDevTools = false;

	win.webContents.on('devtools-opened', () => {
		if(!correctDevTools) {
			win.webContents.closeDevTools();
			correctDevTools = true;
			win.webContents.openDevTools({
				mode:'detach',
			});
		}
	});

	win.webContents.on('devtools-closed', () => {
		if(correctDevTools) {
			correctDevTools = false;
		}
	});
}

app.on('ready', () => {
	createWindow();
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});

	/* const templete = [
		{
			label: 'Platformer',
			submenu: [
				{
					label: 'About Platformer',
					role: 'about',
				},
				{
					role: 'toggleDevTools',
				},
				{
					type: 'separator',
				},
				{
					role: 'reload',
				},
				{
					label: 'Quit Platformer',
				  	role: 'quit',
				},
			],
		},
	];

	Menu.setApplicationMenu(Menu.buildFromTemplate(templete)); */
});


app.on('window-all-closed', () => {
	if(process.platform != 'darwin') app.quit();
});