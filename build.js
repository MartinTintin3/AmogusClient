const { spawn } = require('child_process');
const fs = require('fs');

const args = process.argv.splice(2);


const archs = ['x64', 'ia32', 'armv7l', 'arm64'];
const arch = archs.includes(args[0].toLowerCase()) ? args[0].toLowerCase() : 'x64';
const platforms = ['mac', 'windows', 'linux', 'win'];
const platform = platforms.includes(args[1].toLowerCase()) ? args[1].toLowerCase() : 'mac';

const types = args.length > 2 ? args.splice(2) : false;

try {
	fs.rmdirSync('dist/${os}', {
		recursive: true,
	});
}
catch(e) {
	console.log(e);
}


fs.rm(`./dist/${platform == 'windows' ? 'win' : platform}/${arch}/${platform == 'windows' || platform == 'wind' ? 'win-unpacked' : platform}`, { recursive: true }, err => {
	if(err) console.error(err);
	const build = spawn('npx', ['electron-builder', `--${arch}`, `--${platform}`].concat(types ? types : []), { stdio: 'inherit' });

	process.stderr.setEncoding('utf8');
	process.stdout.setEncoding('utf8');
	process.stdin.setEncoding('utf8');
	build.on('exit', process.exit);
});