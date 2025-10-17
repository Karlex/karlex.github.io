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
let lastMouseMoveTime = 0;
let purrCheckInterval = null;

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

  const now = audioContext.currentTime;
  const oscillators = [];

  // Create multiple oscillators for richer, more natural sound
  // Low rumble (base frequency)
  const osc1 = audioContext.createOscillator();
  osc1.type = "sawtooth";
  osc1.frequency.setValueAtTime(25, now);

  // Mid tone (adds body)
  const osc2 = audioContext.createOscillator();
  osc2.type = "triangle";
  osc2.frequency.setValueAtTime(50, now);

  // Higher harmonic (adds texture)
  const osc3 = audioContext.createOscillator();
  osc3.type = "sine";
  osc3.frequency.setValueAtTime(100, now);

  // Create rhythm/pulse effect (the purr rhythm)
  const lfo1 = audioContext.createOscillator();
  lfo1.type = "sine";
  lfo1.frequency.setValueAtTime(25, now); // ~25 Hz = typical purr rate

  const lfo2 = audioContext.createOscillator();
  lfo2.type = "sine";
  lfo2.frequency.setValueAtTime(26.5, now); // Slightly different for natural variation

  // Gain nodes for each oscillator
  const gain1 = audioContext.createGain();
  const gain2 = audioContext.createGain();
  const gain3 = audioContext.createGain();
  const masterGain = audioContext.createGain();

  // LFO gain nodes
  const lfoGain1 = audioContext.createGain();
  const lfoGain2 = audioContext.createGain();

  lfoGain1.gain.setValueAtTime(8, now);
  lfoGain2.gain.setValueAtTime(5, now);

  // Filter for warmth
  const filter = audioContext.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(400, now);
  filter.Q.setValueAtTime(1.5, now);

  // Add slight variation to filter over time
  filter.frequency.linearRampToValueAtTime(350, now + 0.5);
  filter.frequency.linearRampToValueAtTime(400, now + 1);

  // Set individual gains (balance the layers)
  gain1.gain.setValueAtTime(0.4, now);
  gain2.gain.setValueAtTime(0.3, now);
  gain3.gain.setValueAtTime(0.15, now);

  // Master volume with smoother fade in
  masterGain.gain.setValueAtTime(0.001, now);
  masterGain.gain.exponentialRampToValueAtTime(0.04, now + 0.2); // Smoother fade in

  // Auto-stop after 7 seconds with smooth fade
  setTimeout(() => {
    if (purrSound && purrSound.oscillators.includes(osc1)) {
      const stopNow = audioContext.currentTime;
      masterGain.gain.cancelScheduledValues(stopNow);
      masterGain.gain.setValueAtTime(masterGain.gain.value, stopNow);
      masterGain.gain.exponentialRampToValueAtTime(0.001, stopNow + 0.4);

      setTimeout(() => {
        try {
          oscillators.forEach(osc => osc.stop());
        } catch (e) {
          // Already stopped
        }
        if (purrSound && purrSound.oscillators.includes(osc1)) {
          purrSound = null;
        }
      }, 450);
    }
  }, 6600);

  // Connect LFOs to create pulsing effect
  lfo1.connect(lfoGain1);
  lfo2.connect(lfoGain2);
  lfoGain1.connect(gain1.gain);
  lfoGain2.connect(gain2.gain);

  // Connect oscillators through their gains
  osc1.connect(gain1);
  osc2.connect(gain2);
  osc3.connect(gain3);

  // Mix all through filter and master gain
  gain1.connect(filter);
  gain2.connect(filter);
  gain3.connect(filter);
  filter.connect(masterGain);
  masterGain.connect(audioContext.destination);

  // Start all oscillators
  osc1.start();
  osc2.start();
  osc3.start();
  lfo1.start();
  lfo2.start();

  oscillators.push(osc1, osc2, osc3, lfo1, lfo2);

  return { oscillators, masterGain };
}

function stopPurrSound() {
  if (purrSound) {
    const now = audioContext.currentTime;
    // Longer, smoother fade out to prevent crackling
    purrSound.masterGain.gain.cancelScheduledValues(now);
    purrSound.masterGain.gain.setValueAtTime(purrSound.masterGain.gain.value, now);
    purrSound.masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    setTimeout(() => {
      try {
        purrSound.oscillators.forEach(osc => osc.stop());
      } catch (e) {
        // Oscillators already stopped
      }
      purrSound = null;
    }, 450);
  }
}

function initPurrSound() {
  const kitten = document.querySelector(".kitten");
  const soundToggle = document.querySelector(".sound-toggle");

  kitten.addEventListener("mouseenter", () => {
    lastMouseMoveTime = Date.now();

    if (soundEnabled && !purrSound) {
      purrSound = createPurrSound();

      // Check every 300ms if mouse is still moving
      purrCheckInterval = setInterval(() => {
        const timeSinceLastMove = Date.now() - lastMouseMoveTime;

        // If mouse hasn't moved in 500ms, fade out the purr
        if (timeSinceLastMove > 500 && purrSound) {
          stopPurrSound();
          clearInterval(purrCheckInterval);
          purrCheckInterval = null;
        }
      }, 300);
    }
  });

  kitten.addEventListener("mousemove", () => {
    lastMouseMoveTime = Date.now();

    // Restart purr if it stopped but mouse is moving again
    if (soundEnabled && !purrSound) {
      purrSound = createPurrSound();

      if (!purrCheckInterval) {
        purrCheckInterval = setInterval(() => {
          const timeSinceLastMove = Date.now() - lastMouseMoveTime;

          if (timeSinceLastMove > 500 && purrSound) {
            stopPurrSound();
            clearInterval(purrCheckInterval);
            purrCheckInterval = null;
          }
        }, 300);
      }
    }
  });

  kitten.addEventListener("mouseleave", () => {
    stopPurrSound();
    if (purrCheckInterval) {
      clearInterval(purrCheckInterval);
      purrCheckInterval = null;
    }
  });

  soundToggle.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    soundToggle.classList.toggle("muted");

    if (!soundEnabled) {
      stopPurrSound();
      if (purrCheckInterval) {
        clearInterval(purrCheckInterval);
        purrCheckInterval = null;
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initEyeTracking();
  initPurrSound();
});
