(function () {
  const views = {
    question: document.getElementById("view-question"),
    guest: document.getElementById("view-guest"),
    restaurant: document.getElementById("view-restaurant"),
    activity: document.getElementById("view-activity"),
    notes: document.getElementById("view-notes"),
    result: document.getElementById("view-result"),
  };

  function showView(name) {
    Object.values(views).forEach((v) => v.classList.remove("active"));
    views[name].classList.add("active");
  }

  document.getElementById("question-title").textContent =
    `🎂 ${CONFIG.hostName} sắp sinh nhật rồi!`;
  document.getElementById("question-text").textContent = CONFIG.question;
  document.querySelectorAll(".party-time").forEach((el) => (el.textContent = CONFIG.partyTime));
  document.getElementById("result-thanks").textContent =
    "Mình sẽ chốt quán được chọn nhiều nhất rồi báo lại cả nhóm nha 🎂";

  // ---------------------------------------------------------------------
  // Nhà hàng: gợi ý sẵn trong config + các quán khách trước đã gửi lên
  // ---------------------------------------------------------------------
  const restaurantList = document.getElementById("restaurant-list");
  const restaurantStatus = document.getElementById("restaurant-status");
  const otherRestaurantInput = document.getElementById("input-restaurant-other");

  function normalizeName(name) {
    return name.trim().toLowerCase().replace(/\s+/g, " ");
  }

  function renderRestaurants(suggested) {
    const all = [...suggested];
    CONFIG.restaurants.forEach((name) => {
      if (!all.some((r) => normalizeName(r.name) === normalizeName(name))) all.push({ name, votes: 0 });
    });

    restaurantStatus.textContent = all.length
      ? "Chọn một quán mọi người đã gợi ý, hoặc góp ý quán mới nhé"
      : "Chưa có ai gợi ý, bạn là người đầu tiên đó!";

    restaurantList.replaceChildren(
      ...all.map((r) => restaurantOption(r.name, r.votes, false)),
      restaurantOption("➕ Gợi ý quán khác", 0, true),
    );
  }

  function restaurantOption(name, votes, custom) {
    const label = document.createElement("label");
    label.className = "option-card option-row";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "restaurant";
    input.value = name;
    input.required = true;
    if (custom) input.dataset.custom = "1";
    input.addEventListener("change", () => {
      otherRestaurantInput.classList.toggle("active", custom);
      otherRestaurantInput.required = custom;
    });

    // Tên quán do khách nhập nên luôn gán bằng textContent, không dùng innerHTML
    const text = document.createElement("span");
    text.className = "option-name";
    text.textContent = name;
    label.append(input, text);

    if (votes) {
      const badge = document.createElement("span");
      badge.className = "vote-count";
      badge.textContent = `${votes} phiếu`;
      label.appendChild(badge);
    }
    return label;
  }

  if (CONFIG.scriptUrl) {
    fetch(CONFIG.scriptUrl)
      .then((res) => res.json())
      .then((data) => renderRestaurants(data.restaurants || []))
      .catch(() => {
        renderRestaurants([]);
        restaurantStatus.textContent = "Không tải được gợi ý của mọi người, bạn cứ gợi ý quán mới nhé";
      });
  } else {
    renderRestaurants([]);
  }

  // ---------------------------------------------------------------------
  // Hoạt động sau tiệc
  // ---------------------------------------------------------------------
  const activityGrid = document.getElementById("activity-grid");
  const otherInput = document.getElementById("input-activity-other");
  CONFIG.activities.forEach((activity) => {
    const label = document.createElement("label");
    label.className = "option-card option-card-emoji";
    label.innerHTML = `
      <input type="radio" name="activity" value="${activity.id}" required>
      <span class="emoji">${activity.emoji}</span>
      <span>${activity.label}</span>
    `;
    label.querySelector("input").addEventListener("change", () => {
      otherInput.classList.toggle("active", !!activity.custom);
      otherInput.required = !!activity.custom;
    });
    activityGrid.appendChild(label);
  });

  const answer = { name: "", guests: "", restaurant: "", activityId: "", activityLabel: "", notes: "" };

  document.getElementById("btn-yes").addEventListener("click", () => {
    showView("guest");
  });

  document.getElementById("form-guest").addEventListener("submit", (e) => {
    e.preventDefault();
    answer.name = document.getElementById("input-name").value.trim();
    answer.guests = document.getElementById("input-guests").value;
    showView("restaurant");
  });

  document.getElementById("form-restaurant").addEventListener("submit", (e) => {
    e.preventDefault();
    const selected = document.querySelector('input[name="restaurant"]:checked');
    if (!selected) return;
    answer.restaurant = selected.dataset.custom ? otherRestaurantInput.value.trim() : selected.value;
    showView("activity");
  });

  document.getElementById("form-activity").addEventListener("submit", (e) => {
    e.preventDefault();
    const selected = document.querySelector('input[name="activity"]:checked');
    if (!selected) return;
    const activity = CONFIG.activities.find((a) => a.id === selected.value);
    answer.activityId = activity.id;
    answer.activityLabel = activity.custom ? otherInput.value.trim() : activity.label;

    showView("notes");
  });

  document.getElementById("form-notes").addEventListener("submit", (e) => {
    e.preventDefault();
    answer.notes = document.getElementById("input-notes").value.trim();

    document.getElementById("result-text").textContent =
      `Cảm ơn ${answer.name} nhé, hẹn gặp bạn ở bữa tiệc!`;
    document.getElementById("result-restaurant").textContent = answer.restaurant;
    document.getElementById("result-guests").textContent = answer.guests;
    document.getElementById("result-activity-emoji").textContent =
      CONFIG.activities.find((a) => a.id === answer.activityId).emoji;
    document.getElementById("result-activity-label").textContent = answer.activityLabel;
    document.getElementById("result-notes-row").style.display = answer.notes ? "" : "none";
    document.getElementById("result-notes").textContent = answer.notes;

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
        name: data.name,
        guests: data.guests,
        restaurant: data.restaurant,
        activity: data.activityLabel,
        notes: data.notes,
      }),
    }).catch(() => {});
  }
})();
