(function () {
  const $ = (id) => document.getElementById(id);

  const views = {
    question: $("view-question"),
    guest: $("view-guest"),
    restaurant: $("view-restaurant"),
    activity: $("view-activity"),
    notes: $("view-notes"),
    result: $("view-result"),
  };
  // Các bước có thanh tiến trình và nút quay lại
  const STEPS = ["guest", "restaurant", "activity", "notes"];
  let currentView = "question";

  function showView(name) {
    Object.entries(views).forEach(([key, view]) => view.classList.toggle("active", key === name));
    currentView = name;
    $("btn-no").hidden = name !== "question";

    const step = STEPS.indexOf(name);
    $("progress").hidden = step < 0;
    if (step >= 0) {
      $("progress-fill").style.width = `${((step + 1) / STEPS.length) * 100}%`;
      $("progress-label").textContent = `${step + 1}/${STEPS.length}`;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  $("btn-back").addEventListener("click", () => {
    const step = STEPS.indexOf(currentView);
    showView(step > 0 ? STEPS[step - 1] : "question");
  });

  // ---------------------------------------------------------------------
  // Thời gian tiệc (giờ Việt Nam, UTC+7) và đếm ngược
  // ---------------------------------------------------------------------
  const WEEKDAYS = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
  const party = parsePartyDate(CONFIG.partyDate);

  function parsePartyDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value || "");
    if (!match) return null;
    const [y, mo, d, h, mi] = match.slice(1).map(Number);
    const pad = (n) => String(n).padStart(2, "0");
    return {
      start: new Date(Date.UTC(y, mo - 1, d, h - 7, mi)),
      day: `${WEEKDAYS[new Date(Date.UTC(y, mo - 1, d)).getUTCDay()]}, ${pad(d)}/${pad(mo)}/${y}`,
      hour: `${pad(h)}:${pad(mi)}`,
    };
  }

  $("hero-sub").textContent = `${CONFIG.hostName} sắp sinh nhật rồi! 🥳`;
  $("question-text").textContent = CONFIG.question;
  $("party-day").textContent = party ? party.day : CONFIG.partyDate;
  $("party-hour").textContent = party ? party.hour : "";
  $("party-hour-chip").hidden = !party;
  document.querySelectorAll(".party-time").forEach((el) => {
    el.textContent = party ? `${party.hour} · ${party.day}` : CONFIG.partyDate;
  });
  $("result-thanks").textContent = "Mình sẽ chốt quán được chọn nhiều nhất rồi báo lại cả nhóm nha 🎂";

  const countdown = $("countdown");

  function setCountdownNumber(id, value) {
    const el = $(id);
    const text = String(value).padStart(2, "0");
    if (el.textContent === text) return;
    el.textContent = text;
    el.classList.remove("tick");
    void el.offsetWidth; // chạy lại hiệu ứng nhảy số
    el.classList.add("tick");
  }

  function updateCountdown() {
    const secondsLeft = Math.floor((party.start - Date.now()) / 1000);
    if (secondsLeft <= 0) {
      countdown.innerHTML = '<p class="cd-done">🎉 Tiệc bắt đầu rồi, tới ngay nha!</p>';
      return false;
    }
    setCountdownNumber("cd-days", Math.floor(secondsLeft / 86400));
    setCountdownNumber("cd-hours", Math.floor(secondsLeft / 3600) % 24);
    setCountdownNumber("cd-mins", Math.floor(secondsLeft / 60) % 60);
    setCountdownNumber("cd-secs", secondsLeft % 60);
    return true;
  }

  if (!party) {
    countdown.hidden = true;
  } else if (updateCountdown()) {
    const timer = setInterval(() => {
      if (!updateCountdown()) clearInterval(timer);
    }, 1000);
  }

  // ---------------------------------------------------------------------
  // Bánh kem: chạm để thổi nến, chạm lần nữa để thắp lại
  // ---------------------------------------------------------------------
  const cake = $("cake");
  cake.addEventListener("click", () => {
    const blown = cake.classList.toggle("blown");
    cake.setAttribute("aria-label", blown ? "Thắp lại nến" : "Thổi nến");
    $("cake-hint").textContent = blown
      ? "Ước gì cũng thành sự thật nha! ✨"
      : "Chạm vào bánh để thổi nến 🕯️";
    if (blown && window.burstAt) {
      const rect = cake.getBoundingClientRect();
      window.burstAt(rect.left + rect.width / 2, rect.top + rect.height * 0.15, 90);
    }
  });

  // ---------------------------------------------------------------------
  // Nhà hàng: gợi ý sẵn trong config + các quán khách trước đã gửi lên
  // ---------------------------------------------------------------------
  const restaurantList = $("restaurant-list");
  const restaurantStatus = $("restaurant-status");
  const otherRestaurantInput = $("input-restaurant-other");

  function normalizeName(name) {
    return name.trim().toLowerCase().replace(/\s+/g, " ");
  }

  function renderRestaurants(suggested) {
    const all = [...suggested];
    CONFIG.restaurants.forEach((name) => {
      if (!all.some((r) => normalizeName(r.name) === normalizeName(name))) all.push({ name, votes: 0 });
    });
    const totalVotes = all.reduce((sum, r) => sum + r.votes, 0);
    const topVotes = Math.max(0, ...all.map((r) => r.votes));

    restaurantStatus.textContent = all.length
      ? "Chọn một lựa chọn bên dưới, hoặc gợi ý quán mới nhé"
      : "Chưa có ai gợi ý, bạn là người đầu tiên đó!";

    restaurantList.replaceChildren(
      ...all.map((r) =>
        restaurantOption({
          name: r.name,
          votes: r.votes,
          share: totalVotes ? r.votes / totalVotes : 0,
          leading: r.votes > 0 && r.votes === topVotes,
        })),
      restaurantOption({ name: "➕ Gợi ý quán khác", custom: true }),
    );
  }

  function restaurantOption({ name, votes, share, leading, custom }) {
    const label = document.createElement("label");
    label.className = "option-card option-row" + (custom ? " option-add" : "") + (leading ? " leading" : "");
    if (share) label.style.setProperty("--share", `${Math.round(share * 100)}%`);

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "restaurant";
    input.value = name;
    input.required = true;
    if (custom) input.dataset.custom = "1";
    input.addEventListener("change", () => {
      otherRestaurantInput.classList.toggle("active", !!custom);
      otherRestaurantInput.required = !!custom;
      if (custom) otherRestaurantInput.focus();
    });

    const check = document.createElement("span");
    check.className = "check";

    // Tên quán do khách nhập nên luôn gán bằng textContent, không dùng innerHTML
    const text = document.createElement("span");
    text.className = "option-name";
    text.textContent = name;
    label.append(input, check, text);

    if (votes) {
      const badge = document.createElement("span");
      badge.className = "vote-count";
      badge.textContent = `${leading ? "👑 " : ""}${votes} phiếu`;
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
  const activityGrid = $("activity-grid");
  const otherActivityInput = $("input-activity-other");
  CONFIG.activities.forEach((activity) => {
    const label = document.createElement("label");
    label.className = "option-card option-tile";
    label.innerHTML = `
      <input type="radio" name="activity" value="${activity.id}" required>
      <span class="check"></span>
      <span class="emoji">${activity.emoji}</span>
      <span class="option-name">${activity.label}</span>
    `;
    label.querySelector("input").addEventListener("change", () => {
      otherActivityInput.classList.toggle("active", !!activity.custom);
      otherActivityInput.required = !!activity.custom;
      if (activity.custom) otherActivityInput.focus();
    });
    activityGrid.appendChild(label);
  });

  // ---------------------------------------------------------------------
  // Nút +/- số người và các câu nhắn nhanh
  // ---------------------------------------------------------------------
  const guestsInput = $("input-guests");
  document.querySelectorAll(".counter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = (Number(guestsInput.value) || 1) + Number(btn.dataset.step);
      guestsInput.value = Math.min(20, Math.max(1, next));
    });
  });

  const notesInput = $("input-notes");
  document.querySelectorAll(".quick-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const text = chip.dataset.text;
      const current = notesInput.value.trim();
      if (!current.includes(text)) notesInput.value = current ? `${current}\n${text}` : text;
      chip.classList.add("used");
    });
  });

  // ---------------------------------------------------------------------
  // Luồng các bước
  // ---------------------------------------------------------------------
  const answer = { name: "", guests: "", restaurant: "", activityLabel: "", activityEmoji: "", notes: "" };

  $("btn-yes").addEventListener("click", () => {
    const rect = $("btn-yes").getBoundingClientRect();
    if (window.burstAt) window.burstAt(rect.left + rect.width / 2, rect.top, 40);
    showView("guest");
  });

  $("form-guest").addEventListener("submit", (e) => {
    e.preventDefault();
    answer.name = $("input-name").value.trim();
    answer.guests = guestsInput.value;
    showView("restaurant");
  });

  $("form-restaurant").addEventListener("submit", (e) => {
    e.preventDefault();
    const selected = document.querySelector('input[name="restaurant"]:checked');
    if (!selected) return;
    answer.restaurant = selected.dataset.custom ? otherRestaurantInput.value.trim() : selected.value;
    showView("activity");
  });

  $("form-activity").addEventListener("submit", (e) => {
    e.preventDefault();
    const selected = document.querySelector('input[name="activity"]:checked');
    if (!selected) return;
    const activity = CONFIG.activities.find((a) => a.id === selected.value);
    answer.activityEmoji = activity.emoji;
    answer.activityLabel = activity.custom ? otherActivityInput.value.trim() : activity.label;
    showView("notes");
  });

  $("form-notes").addEventListener("submit", (e) => {
    e.preventDefault();
    answer.notes = notesInput.value.trim();

    $("result-text").textContent = `Cảm ơn ${answer.name} nhé, hẹn gặp bạn ở bữa tiệc!`;
    $("ticket-name").textContent = answer.name;
    $("result-restaurant").textContent = answer.restaurant;
    $("result-guests").textContent = `${answer.guests} người`;
    $("result-activity").textContent = `${answer.activityEmoji} ${answer.activityLabel}`;
    $("result-notes-row").hidden = !answer.notes;
    $("result-notes").textContent = answer.notes;

    const calendarBtn = $("btn-calendar");
    calendarBtn.hidden = !party;
    if (party) calendarBtn.href = calendarUrl();

    submitAnswer(answer);
    showView("result");
    if (window.celebrate) window.celebrate(4000);
  });

  // Link mở Google Calendar với sự kiện điền sẵn (mặc định kéo dài 3 tiếng)
  function calendarUrl() {
    const format = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const end = new Date(party.start.getTime() + 3 * 60 * 60 * 1000);
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `🎂 Sinh nhật ${CONFIG.hostName}`,
      dates: `${format(party.start)}/${format(end)}`,
      details: `Nhà hàng: cả nhóm đang bình chọn, sẽ chốt sau.\nThiệp mời: ${location.href.split("#")[0]}`,
    });
    return `https://calendar.google.com/calendar/render?${params}`;
  }

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
