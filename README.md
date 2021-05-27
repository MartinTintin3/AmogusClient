# About
*Amogus Client* is a custom [Among Us](https://innersloth.com/gameAmongUs.php) client coded in JavaScript. It uses [SkeldJS](https://github.com/SkeldJS/SkeldJS) for all the Among Us protocol related things, [Electron](https://www.electronjs.org/) for the desktop framework, [React](https://reactjs.org) for the UI, and obviously [Node.js](https://nodejs.org) for the JavaScript runtime and other extra libraries
# Building from source
**Requirements:**

* Node >=15
* NPM >=7

To build the client, first make sure you have cloned this repository with `git clone https://github.com/martinGITHUBER/AmogusClient`. Then, `cd` in that directory and run `npm i` to install all dependancies. After this, you are ready to build. You need to use the `npm run build` with the arguments in this format:<br/>
`npm run build --<arch type> --<platform> <list of output types seperated by spaces>`<br/><br/>
*`arch type` - `x64` for 64-bit, `ia32` for 32-bit, `armv7l` for armv7l, and `arm64` for arm64*<br/>
*`platform` - `mac` for macos, `linux` for linux, and `win` for windows*<br/>
*`output type` - Any type of output type(dmg and pkg for macos, nsis for windows, deb, rpm, apk for linux, and zip is universal). A full list can be found in the specific target page for macos, windows, or linux [here](https://www.electron.build)*<br/>

Here is an example command to build a .dmg for macos: `npm run build x64 mac dmg`

The output will be in: `dist/<platform>/<arch type>`

For more information about command line arguments, check out the [electron-builder docs](https://www.electron.build/cli) ***WARNING: MAKE SURE TO IGNORE THE `--` THAT THE DOCUMENTATION PROVIDES. BUILD.JS PARSES THE ARGUMENTS WITHOUT THE `--`***

*Note: electron-builder package version is set to `22.10.4` because `22.10.5` causes an error when builing for macos*

# TO-DO
- [ ] Add basic Among Us UI elements
- [ ] Connect UI elements with corresponding Skeld.js calls
- [ ] Add extra cool UI elements

Credit goes to everyone who contributed to the frameworks/libraries used in this project