// Shiny Umbreon easter egg (7% chance)
function checkShinyVariant() {
    const shinyChance = Math.random();
    if (shinyChance < 0.07) { // 7% chance
        document.body.classList.add('shiny');
        console.log('✨ A shiny Umbreon appeared! ✨');
    }
}

// Pupil tracking
function initPupilTracking() {
    const leftEye = document.getElementById('leftEye');
    const rightEye = document.getElementById('rightEye');
    const leftPupil = document.getElementById('leftPupil');
    const rightPupil = document.getElementById('rightPupil');

    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Track left eye
        const leftRect = leftEye.getBoundingClientRect();
        const leftEyeX = leftRect.left + leftRect.width / 2;
        const leftEyeY = leftRect.top + leftRect.height / 2;

        const leftAngle = Math.atan2(mouseY - leftEyeY, mouseX - leftEyeX);
        const leftDistance = Math.min(3, Math.hypot(mouseX - leftEyeX, mouseY - leftEyeY) / 50);

        const leftPupilX = Math.cos(leftAngle) * leftDistance;
        const leftPupilY = Math.sin(leftAngle) * leftDistance;

        leftEye.style.setProperty('--pupil-x', `${leftPupilX}px`);
        leftEye.style.setProperty('--pupil-y', `${leftPupilY}px`);

        // Track right eye
        const rightRect = rightEye.getBoundingClientRect();
        const rightEyeX = rightRect.left + rightRect.width / 2;
        const rightEyeY = rightRect.top + rightRect.height / 2;

        const rightAngle = Math.atan2(mouseY - rightEyeY, mouseX - rightEyeX);
        const rightDistance = Math.min(3, Math.hypot(mouseX - rightEyeX, mouseY - rightEyeY) / 50);

        const rightPupilX = Math.cos(rightAngle) * rightDistance;
        const rightPupilY = Math.sin(rightAngle) * rightDistance;

        rightEye.style.setProperty('--pupil-x', `${rightPupilX}px`);
        rightEye.style.setProperty('--pupil-y', `${rightPupilY}px`);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    checkShinyVariant();
    initPupilTracking();
});
