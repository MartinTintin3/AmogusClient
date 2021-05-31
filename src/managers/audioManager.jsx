export class AudioManager {
	constructor(game) {
		this.game = game;
		this.currentSounds = [];
	}

	addSound(name, path, type, shouldRepeat) {
		const audio = new Audio(`assets/sounds${path.startsWith('/') ? path : '/' + path}`);
		audio.controls = false;

		audio.addEventListener('canplaythrough', () => {
			audio.volume = type == 'ui' ? this.game.config.sound.ui : type == 'game' ? this.game.config.sound.game : type == 'music' ? this.game.config.sound.music : 1;
			audio.loop = shouldRepeat instanceof Boolean ? shouldRepeat : false;

			audio.play();
			this.currentSounds.push({
				name,
				object: audio,
			});
		});

		audio.onended = () => {
			this.currentSounds.splice(this.currentSounds.findIndex(sound => sound.name == name), 1);
		};
	}

	removeSound(name) {
		const index = this.currentSounds.findIndex(sound => sound.name == name);
		if(index >= 0) {
			this.currentSounds[index].object.pause();
			this.currentSounds.splice(index, 1);
		}
	}
}