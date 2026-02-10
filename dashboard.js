let xp = 120;
let score = 450;
let streak = 3;

function openChallenge() {
  document.getElementById("challengeModal").style.display = "flex";
}

function closeChallenge() {
  document.getElementById("challengeModal").style.display = "none";
}

function submitAnswer(correct) {
  const res = document.getElementById("result");

  if (correct) {
    xp += 20;
    score += 50;
    streak += 1;

    document.getElementById("xp").textContent = xp;
    document.getElementById("score").textContent = score;
    document.getElementById("streak").textContent = streak;

    res.textContent = "✅ Correct! +20 XP";
    res.style.color = "green";
  } else {
    res.textContent = "❌ Incorrect. Try again tomorrow!";
    res.style.color = "red";
  }
}
