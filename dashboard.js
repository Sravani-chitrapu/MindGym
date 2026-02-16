// XP Animation
window.onload = function () {
    document.getElementById("xpFill").style.width = "75%";
};

// Live Clock
function updateClock() {
    const now = new Date();
    document.getElementById("liveClock").innerText =
        now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Theme Toggle
document.getElementById("themeToggle").addEventListener("click", function () {
    document.body.classList.toggle("light");
});

// Confetti
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let confetti = [];

function createConfetti() {
    confetti = [];
    for (let i = 0; i < 120; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 6 + 2,
            d: Math.random() * 10
        });
    }
}

function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "cyan";
    confetti.forEach(c => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();
    });
}

function updateConfetti() {
    confetti.forEach(c => {
        c.y += 3;
        if (c.y > canvas.height) c.y = 0;
    });
}

function animateConfetti() {
    drawConfetti();
    updateConfetti();
    requestAnimationFrame(animateConfetti);
}

document.getElementById("claimReward").addEventListener("click", function () {
    createConfetti();
    animateConfetti();
});
