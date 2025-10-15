const themes = [
  {
    name: "pastel pink",
    gradient:
      "linear-gradient(135deg, #ffc0e0 0%, #ffb3d9 25%, #ffa6d1 50%, #ff99ca 75%, #ff8cc2 100%)",
  },
  {
    name: "rose pink",
    gradient:
      "linear-gradient(135deg, #ffb3d9 0%, #ffa6d1 25%, #ff99ca 50%, #ff8cc2 75%, #ff7fba 100%)",
  },
  {
    name: "hot pink",
    gradient:
      "linear-gradient(135deg, #ff99d9 0%, #ff8cd1 25%, #ff7fc9 50%, #ff72c1 75%, #ff65b9 100%)",
  },
  {
    name: "coral pink",
    gradient:
      "linear-gradient(135deg, #ffd4d4 0%, #ffc7c7 25%, #ffbaba 50%, #ffadad 75%, #ffa0a0 100%)",
  },
  {
    name: "lavender pink",
    gradient:
      "linear-gradient(135deg, #f5c0e0 0%, #f0b3d9 25%, #eba6d1 50%, #e699ca 75%, #e18cc2 100%)",
  },
];

let currentThemeIndex = 0;
let soundEnabled = true;
let audioContext = null;
let purrSound = null;

function initThemeSwitcher() {
  const body = document.body;
  const switcher = document.querySelector(".theme-switcher");

  switcher.addEventListener("click", () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    body.style.background = themes[currentThemeIndex].gradient;
  });
}

function initEyeTracking() {
  const eyes = document.querySelectorAll(".eye");

  document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    eyes.forEach((eye) => {
      const rect = eye.getBoundingClientRect();
      const eyeX = rect.left + rect.width / 2;
      const eyeY = rect.top + rect.height / 2;

      const angle = Math.atan2(mouseY - eyeY, mouseX - eyeX);
      const distance = Math.min(
        6,
        Math.hypot(mouseX - eyeX, mouseY - eyeY) / 30,
      );

      const pupilX = Math.cos(angle) * distance;
      const pupilY = Math.sin(angle) * distance;

      eye.style.setProperty("--pupil-x", `${pupilX}px`);
      eye.style.setProperty("--pupil-y", `${pupilY}px`);
    });
  });
}

function createPurrSound() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  const mainOsc = audioContext.createOscillator();
  const lfoOsc = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const lfoGain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();

  mainOsc.type = "sine";
  mainOsc.frequency.setValueAtTime(80, audioContext.currentTime);

  lfoOsc.type = "sine";
  lfoOsc.frequency.setValueAtTime(28, audioContext.currentTime);

  lfoGain.gain.setValueAtTime(12, audioContext.currentTime);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(250, audioContext.currentTime);
  filter.Q.setValueAtTime(0.7, audioContext.currentTime);

  gainNode.gain.setValueAtTime(0.025, audioContext.currentTime);

  lfoOsc.connect(lfoGain);
  lfoGain.connect(mainOsc.frequency);

  mainOsc.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioContext.destination);

  mainOsc.start();
  lfoOsc.start();

  return { mainOsc, lfoOsc };
}

function stopPurrSound() {
  if (purrSound) {
    try {
      purrSound.mainOsc.stop();
      purrSound.lfoOsc.stop();
    } catch (e) {
      // Oscillators already stopped
    }
    purrSound = null;
  }
}

function initPurrSound() {
  const kitten = document.querySelector(".kitten");
  const soundToggle = document.querySelector(".sound-toggle");

  kitten.addEventListener("mouseenter", () => {
    if (soundEnabled && !purrSound) {
      purrSound = createPurrSound();
    }
  });

  kitten.addEventListener("mouseleave", () => {
    stopPurrSound();
  });

  soundToggle.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    soundToggle.classList.toggle("muted");

    if (!soundEnabled) {
      stopPurrSound();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initThemeSwitcher();
  initEyeTracking();
  initPurrSound();
});
