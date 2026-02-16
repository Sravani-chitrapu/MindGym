const brainCard = document.getElementById("brainCard");
const speedCard = document.getElementById("speedCard");
const reactionCard = document.getElementById("reactionCard");
const mathCard = document.getElementById("mathCard");

/* Brain Explosion */
brainCard.addEventListener("click", () => {
    const img = brainCard.querySelector("img");
    img.classList.add("explode");

    setTimeout(()=>{
        document.body.classList.add("zoomOut");
        setTimeout(()=>{
            window.location.href="brain.html";
        },800);
    },600);
});

/* Speed Burnout */
speedCard.addEventListener("click", () => {
    const smoke = document.createElement("div");
    smoke.classList.add("smoke");
    speedCard.appendChild(smoke);

    setTimeout(()=>{
        document.body.classList.add("zoomOut");
        setTimeout(()=>{
            window.location.href="speed.html";
        },800);
    },700);
});

/* Reaction Flash */
reactionCard.addEventListener("click", () => {
    document.body.style.background="white";
    setTimeout(()=>{
        document.body.classList.add("zoomOut");
        setTimeout(()=>{
            window.location.href="reaction.html";
        },800);
    },300);
});

/* Math Spin */
mathCard.addEventListener("click", () => {
    const img = mathCard.querySelector("img");
    img.style.transform="scale(1.6) rotate(360deg)";
    img.style.transition="0.6s";

    setTimeout(()=>{
        document.body.classList.add("zoomOut");
        setTimeout(()=>{
            window.location.href="math.html";
        },800);
    },600);
});