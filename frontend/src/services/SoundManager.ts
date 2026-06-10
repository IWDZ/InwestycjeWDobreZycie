import warningSound from "../../assets/audio/warning.mp3";
import joinroomSound from "../../assets/audio/joinroom.mp3";
import nukearrivalSound from "../../assets/audio/nukearrival.mp3";
import nukelaunchSound from "../../assets/audio/nukelaunch.mp3";


type SoundKey = "warning" | "joinroom" | "nukearrival" | "nukelaunch";

class SoundManager {
  private sounds: Record<SoundKey, HTMLAudioElement>;
  private volume = 0.3;

  constructor() {
    this.sounds = {
      warning: this.create(warningSound),
      joinroom: this.create(joinroomSound),
      nukearrival: this.create(nukearrivalSound),
      nukelaunch: this.create(nukelaunchSound)

    };
  }

  private create(src: string) {
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = this.volume;
    return audio;
  }

  play(key: SoundKey) {
    const sound = this.sounds[key];
    if (!sound) return;

    sound.currentTime = 0;
    sound.play();
  }

  setVolume(volume: number) {
    this.volume = volume;
    Object.values(this.sounds).forEach((s) => {
      s.volume = volume;
    });
  }
}

export const soundManager = new SoundManager();