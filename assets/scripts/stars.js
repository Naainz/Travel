// assets/scripts/stars.js

const starsContainer = document.getElementById('starsContainer');
const starCount = Math.ceil(window.innerWidth / 40) * Math.ceil(window.innerHeight / 40) * 1.3;
const stars = [];

for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    starsContainer.appendChild(star);
    stars.push(star);
}

document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    stars.forEach(star => {
        const rect = star.getBoundingClientRect();
        const starX = rect.left + rect.width / 2;
        const starY = rect.top + rect.height / 2;

        const distance = Math.sqrt(Math.pow(mouseX - starX, 2) + Math.pow(mouseY - starY, 2));

        if (distance < 75) {
            star.style.opacity = 0.5;
        } else if (distance < 100) {
            star.style.opacity = 0.35;
        } else {
            star.style.opacity = 0.05;
        }
    });
});
