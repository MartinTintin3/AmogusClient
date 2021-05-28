/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 890:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 933:
/***/ ((module) => {

"use strict";
module.exports = require("electron");;

/***/ }),

/***/ 622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const {
  remote
} = __webpack_require__(933);

const path = __webpack_require__(622);

console.log(remote.getCurrentWebContents().getTitle());

const fs = remote.require('fs');

__webpack_require__(890);

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

if (!fs.existsSync(path.join(appDataDirPath, 'servers.json'))) {
  const data = {
    currentlySelected: 0,
    servers: [{
      name: 'North America',
      host: 'na.mm.among.us',
      port: '22023'
    }, {
      name: 'Europe',
      host: 'eu.mm.among.us',
      port: '22023'
    }, {
      name: 'Asia',
      host: 'as.mm.among.us',
      port: '22023'
    }]
  };
  fs.writeFileSync(path.join(appDataDirPath, 'servers.json'), JSON.stringify(data), err => {
    console.err(err);
    process.exit();
  });
  console.log(fs.readFileSync(path.join(appDataDirPath, 'servers.json')).toString());
}
})();

/******/ })()
;