(function () {
  const views = {
    question: document.getElementById("view-question"),
    datetime: document.getElementById("view-datetime"),
    activity: document.getElementById("view-activity"),
    result: document.getElementById("view-result"),
  };

  function showView(name) {
    Object.values(views).forEach((v) => v.classList.remove("active"));
    views[name].classList.add("active");
  }

  document.getElementById("question-title").textContent =
    `${CONFIG.yourName} có một điều muốn hỏi ${CONFIG.girlName}...`;
  document.getElementById("question-text").textContent = CONFIG.question;
  document.getElementById("datetime-text").textContent =
    `Em muốn buổi hẹn diễn ra vào thời gian nào?`;
  document.getElementById("activity-text").textContent =
    `Chọn hoạt động ${CONFIG.girlName} thích nhất`;
  document.getElementById("result-text").textContent =
    `${CONFIG.girlName} đã đồng ý hẹn hò với ${CONFIG.yourName}!`;
  document.getElementById("result-thanks").textContent = `Hẹn gặp ${CONFIG.girlName} nhé! 💖`;

  const activityForm = document.getElementById("form-activity");
  const submitButton = activityForm.querySelector("button");
  CONFIG.activities.forEach((activity) => {
    const label = document.createElement("label");
    label.className = "option-card option-card-emoji";
    label.innerHTML = `
      <input type="radio" name="activity" value="${activity.id}" required>
      <span class="emoji">${activity.emoji}</span>
      <span>${activity.label}</span>
    `;
    activityForm.insertBefore(label, submitButton);
  });

  const answer = { datetime: "", activityId: "", activityLabel: "" };

  document.getElementById("btn-yes").addEventListener("click", () => {
    showView("datetime");
  });

  document.getElementById("form-datetime").addEventListener("submit", (e) => {
    e.preventDefault();
    answer.datetime = document.getElementById("input-datetime").value.trim();
    showView("activity");
  });

  document.getElementById("form-activity").addEventListener("submit", (e) => {
    e.preventDefault();
    const selected = document.querySelector('input[name="activity"]:checked');
    if (!selected) return;
    const activity = CONFIG.activities.find((a) => a.id === selected.value);
    answer.activityId = activity.id;
    answer.activityLabel = activity.label;

    document.getElementById("result-datetime").textContent = answer.datetime;
    document.getElementById("result-activity-emoji").textContent = activity.emoji;
    document.getElementById("result-activity-label").textContent = activity.label;

    submitAnswer(answer);
    showView("result");
    if (window.celebrate) window.celebrate(4000);
  });

  function submitAnswer(data) {
    if (!CONFIG.scriptUrl) return;
    fetch(CONFIG.scriptUrl, {
      method: "POST",
      mode: "no-cors",
      body: new URLSearchParams({
        datetime: data.datetime,
        activity: data.activityLabel,
      }),
    }).catch(() => {});
  }
})();
