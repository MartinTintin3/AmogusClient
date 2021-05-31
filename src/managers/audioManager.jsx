export class AudioManager {
	constructor(game) {
		this.game = game;
		this.currentSounds = [];
		this.volume = {
			ui: 0.5,
			music: 1,
			game: 1,
		};
	}

	addSound(name, path, type, shouldRepeat) {
		const audio = new Audio(`assets/sounds${path.startsWith('/') ? path : '/' + path}`);
		audio.controls = false;

		audio.addEventListener('canplaythrough', () => {
			audio.volume = type == 'ui' ? this.volume.ui : type == 'game' ? this.volume.game : type == 'music' ? this.volume.music : 1;
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
			console.log(this.currentSounds);
			this.currentSounds[index].object.pause();
			this.currentSounds.splice(index, 1);
		}
	}
}