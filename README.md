# About
*Amogus Client* is a custom [Among Us](https://innersloth.com/gameAmongUs.php) client coded in JavaScript. It uses [SkeldJS](https://github.com/SkeldJS/SkeldJS) for all the Among Us protocol related things, [Electron](https://www.electronjs.org/) for the desktop framework, [React](https://reactjs.org) for the UI, and obviously [Node.js](https://nodejs.org) for the JavaScript runtime and other extra libraries
# Building from source
**Requirements:**

* Node >=15
* NPM >=7

First clone the repository
`git clone https://github.com/martinGITHUBER/AmogusClient`
Install all dependancies
`npm i`
Next, if you have changed anything in `src/` then make sure to bundle it up into bundle.css and bundle.js
`npm run bundle`
Finally, to build the application, run: `npm run build <arch> <platform> <output type>`

Explanation for the arguments are below:
* `arch type` - `x64` for 64-bit, `ia32` for 32-bit, `armv7l` for armv7l, and `arm64` for arm64
* `platform` - `mac` for macos, `linux` for linux, and `win` for windows*<br/>
* `output type` - The type of the output file that will be put in `dist/<platform>/<arch type>`. Here is a table for the output types available for different platforms(Some output types require configuration in the "build" section of package.json. Feel free to new ones)
Platform | Output Types
---------|-------------

Here is an example command to build a .dmg for macos: `npm run build x64 mac dmg`

The output will be in: `dist/<platform>/<arch type>`

For more information about command line arguments, check out the [electron-builder docs](https://www.electron.build/cli) ***WARNING: MAKE SURE TO IGNORE THE `--` THAT THE DOCUMENTATION PROVIDES. BUILD.JS PARSES THE ARGUMENTS WITHOUT THE `--`***

*Note: electron-builder package version is set to `22.10.4` because `22.10.5` causes an error when builing for macos*

# TO-DO
- [ ] Add basic Among Us UI elements
- [ ] Connect UI elements with corresponding Skeld.js calls
- [ ] Add extra cool UI elements

Credit goes to everyone who contributed to the frameworks/libraries used in this project