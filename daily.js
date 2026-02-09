let time = 180;
let timerInterval;
let answered = false;

const timerEl = document.getElementById("timer");
const feedback = document.getElementById("feedback");
const continueBtn = document.getElementById("continueBtn");

function startTimer() {
  timerInterval = setInterval(() => {
    time--;
    let min = Math.floor(time / 60);
    let sec = time % 60;

    timerEl.textContent =
      `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;

    if (time <= 0) {
      clearInterval(timerInterval);
      feedback.textContent = "⏰ Time’s up!";
      feedback.style.color = "red";
      continueBtn.style.display = "inline-block";
    }
  }, 1000);
}

startTimer();

function checkAnswer(ans) {
  if (answered) return;
  answered = true;
  clearInterval(timerInterval);

  if (ans === 30) {
    feedback.textContent = "✅ Correct! Great logic!";
    feedback.style.color = "green";
  } else {
    feedback.textContent = "❌ Wrong! Correct answer is 30.";
    feedback.style.color = "red";
  }

  continueBtn.style.display = "inline-block";
}

function goToDashboard() {
  window.location.href = "dashboard.html";
}
