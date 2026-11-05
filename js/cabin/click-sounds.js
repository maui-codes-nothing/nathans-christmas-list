function sound(file, preload = "auto") {
  const audio = new Audio(new URL(`../../assets/audio/${file}`, import.meta.url));
  audio.preload = preload;
  return audio;
}

const present = sound("present.wav");
const paper = sound("paper.wav");
const stocking = sound("stocking.wav");
const backgroundTracks = ["winter-post.mp3", "cabin-ambience.mp3"].map(file => {
  const track = sound(file, "none");
  track.loop = true;
  return track;
});

const doorSounds = {
  family: present,
  personal: paper,
  privileges: paper,
  parents: stocking,
  stuffers: stocking,
};

export function playDoorSound(door) {
  const audio = doorSounds[door];
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

export function startBackgroundAudio() {
  async function start() {
    try {
      await Promise.all(backgroundTracks.map(track => track.play()));
      document.removeEventListener("click", start, true);
      document.removeEventListener("keydown", start, true);
    } catch {
      // Audible autoplay may require a gesture. Retry on the first click or keypress anywhere.
    }
  }

  document.addEventListener("click", start, true);
  document.addEventListener("keydown", start, true);
  void start();
}
