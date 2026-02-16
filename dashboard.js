// XP Animation
window.onload = function(){
document.getElementById("xpFill").style.width="75%";
initCircles();
};

// Live Clock
setInterval(()=>{
document.getElementById("liveClock").innerText=new Date().toLocaleTimeString();
},1000);

// Animate Circular Stats
function initCircles(){
document.querySelectorAll(".circle").forEach(circle=>{
let percent=circle.getAttribute("data-percent");
let degree=percent*3.6;
circle.style.background=`conic-gradient(#00f2fe ${degree}deg,#333 ${degree}deg)`;
});
}

// Confetti
const canvas=document.getElementById("confettiCanvas");
const ctx=canvas.getContext("2d");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let confetti=[];
let animation;

function createConfetti(){
confetti=[];
for(let i=0;i<100;i++){
confetti.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
r:Math.random()*6+2
});
}
}

function draw(){
ctx.clearRect(0,0,canvas.width,canvas.height);
ctx.fillStyle="cyan";
confetti.forEach(c=>{
ctx.beginPath();
ctx.arc(c.x,c.y,c.r,0,Math.PI*2);
ctx.fill();
c.y+=3;
});
animation=requestAnimationFrame(draw);
}

document.getElementById("claimReward").addEventListener("click",()=>{
createConfetti();
draw();

setTimeout(()=>{
cancelAnimationFrame(animation);
ctx.clearRect(0,0,canvas.width,canvas.height);
},3000);

document.getElementById("rewardModal").style.display="flex";
});

document.getElementById("closeModal").addEventListener("click",()=>{
document.getElementById("rewardModal").style.display="none";
});
