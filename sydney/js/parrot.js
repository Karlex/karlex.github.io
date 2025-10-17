// Parrot interaction and sound - static parrot on branch
let parrotAudioContext = null;
let parrotSound = null;
let parrotSoundEnabled = true;

function createParrotChirp() {
    if (!parrotAudioContext) {
        parrotAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (parrotAudioContext.state === 'suspended') {
        parrotAudioContext.resume();
    }

    // Create a short chirp sound
    const oscillator = parrotAudioContext.createOscillator();
    const gainNode = parrotAudioContext.createGain();
    const filter = parrotAudioContext.createBiquadFilter();

    // Set up the oscillator for a bird-like chirp
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1800, parrotAudioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(2400, parrotAudioContext.currentTime + 0.05);
    oscillator.frequency.exponentialRampToValueAtTime(1600, parrotAudioContext.currentTime + 0.1);

    // Set up the filter for a brighter sound
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2000, parrotAudioContext.currentTime);
    filter.Q.setValueAtTime(1, parrotAudioContext.currentTime);

    // Envelope for the chirp - quieter
    gainNode.gain.setValueAtTime(0, parrotAudioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.008, parrotAudioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, parrotAudioContext.currentTime + 0.15);

    // Connect the nodes
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(parrotAudioContext.destination);

    // Start and stop the oscillator
    oscillator.start(parrotAudioContext.currentTime);
    oscillator.stop(parrotAudioContext.currentTime + 0.15);

    return oscillator;
}

function playParrotChirp() {
    if (parrotSoundEnabled && !parrotSound) {
        parrotSound = createParrotChirp();

        // Allow playing another chirp after a short delay
        setTimeout(() => {
            parrotSound = null;
        }, 200);
    }
}

function initParrotInteraction() {
    const parrot = document.querySelector('.parrot');
    const soundToggle = document.querySelector('.sound-toggle');

    if (!parrot) return;

    // Play chirp on click
    parrot.addEventListener('click', (e) => {
        e.stopPropagation();
        playParrotChirp();
    });

    // Play chirp on hover
    parrot.addEventListener('mouseenter', () => {
        playParrotChirp();
    });

    // Sync with the cat's sound toggle
    if (soundToggle) {
        const checkMuted = () => {
            parrotSoundEnabled = !soundToggle.classList.contains('muted');
        };
        soundToggle.addEventListener('click', checkMuted);
        checkMuted(); // Initial check
    }

    // Random occasional chirps
    setInterval(() => {
        if (Math.random() < 0.12 && parrotSoundEnabled) { // 12% chance
            playParrotChirp();
        }
    }, 10000); // Check every 10 seconds
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParrotInteraction);
} else {
    initParrotInteraction();
}
