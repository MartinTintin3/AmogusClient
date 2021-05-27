# About
*Amogus Client* is a custom [Among Us](https://innersloth.com/gameAmongUs.php) client coded in JavaScript. It uses [SkeldJS](https://github.com/SkeldJS/SkeldJS) for all the Among Us protocol related things, [Electron](https://www.electronjs.org/) for the desktop framework, [React](https://reactjs.org) for the UI, and obviously [Node.js](https://nodejs.org) for the JavaScript runtime and other extra libraries

# File structure
The `src` folder contains all the .jsx, js, and .scss files that will be compiled into the app

The `app` folder contains the core .html files and `main.js` which is used for electron.js setup

The `app/build.js` file should NOT be touched. This is the js output you get when you compile everything in `src`

The `app/bundle.css` file is the bundled version of all the .scss files in `src`. Just like `build.js`, this file should NOT be touched

# Building from source
**Requirements:**

* Node >=15
* NPM >=7

First clone the repository
`git clone https://github.com/martinGITHUBER/AmogusClient`
Install all dependancies
`npm i`
Next, if you have changed anything in `src` then make sure to bundle it up into bundle.css and bundle.js
`npm run bundle`
Finally, to build the application, run: `npm run build <arch> <platform> <output type>`

Explanation for the arguments are below:
* `arch type` - `x64` for 64-bit, `ia32` for 32-bit, `armv7l` for armv7l, and `arm64` for arm64
* `platform` - `mac` for macos, `linux` for linux, and `win` for windows*<br/>
* `output type` - The type of the output file that will be put in `dist/<platform>/<arch type>`. Here is a table for the output types available for different platforms(Some output types require configuration in the "build" section of package.json. Feel free to contribute new ones. The docs for all of them are in the configurations section [here](https://www.electron.build)):

Platform | Output Types
-------- | ------------
Windows | `nsis`(Default), `appx`(Only for Windows 10), `squirrel`
MacOS | `dmg`(Default. zip will also be built), `mas`, `pkg`
Linux | `AppImage`, `snap`, `deb`, `rpm`, `apk`
Universal | zip, 7z, tar.xz, tar.gz, tar.lz, tar.bz2

Here is an example command to build a .dmg for macos: `npm run build x64 mac dmg`

The output will be in: `dist/<platform>/<arch type>`

*Note: electron-builder package version is set to `22.10.4` because `22.10.5` causes an error when builing for macos*

# TO-DO
- [ ] Add basic Among Us UI elements
- [ ] Connect UI elements with corresponding Skeld.js calls
- [ ] Add extra cool UI elements

Credit goes to everyone who contributed to the frameworks/libraries used in this project

***Disclaimer: We are not responsible for any of your actions and the results of your actions. If you get banned when using this client, its not our fault. Consider making a custom [Impostor](https://github.com/Impostor/Impostor) server so that you don't get banned on the official ones***