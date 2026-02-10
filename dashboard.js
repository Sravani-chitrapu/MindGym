let xp = 150;
let score = 480;
let streak = 4;

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
    res.textContent = "❌ Wrong! Try again tomorrow";
    res.style.color = "red";
  }
}

function goGames() {
  window.location.href = "brain-games.html";
}

function goLeaderboard() {
  window.location.href = "leaderboard.html";
}
