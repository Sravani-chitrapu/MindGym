function openChallenge() {
  document.getElementById("challengeModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("challengeModal").style.display = "none";
}

function answer(ans) {
  const result = document.getElementById("result");

  if (ans === 30) {
    result.textContent = "✅ Correct! +10 XP";
    result.style.color = "green";
  } else {
    result.textContent = "❌ Wrong! Try again tomorrow";
    result.style.color = "red";
  }
}
