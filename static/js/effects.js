(function () {
  const canvas = document.getElementById("fx-canvas");
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width, height;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const COLORS = ["#ff5fa2", "#ffd166", "#4cc9f0", "#7ae582", "#b794f6", "#ff8c42"];

  // ---------------------------------------------------------------------
  // Sao lấp lánh nền (toạ độ tính theo tỉ lệ màn hình)
  // ---------------------------------------------------------------------
  const stars = Array.from({ length: 70 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: 0.4 + Math.random() * 1.1,
    phase: Math.random() * Math.PI * 2,
    speed: 0.6 + Math.random() * 1.6,
  }));

  function drawStars(t) {
    ctx.fillStyle = "#fff";
    stars.forEach((s) => {
      ctx.globalAlpha = 0.15 + 0.6 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x * width, s.y * height, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  // ---------------------------------------------------------------------
  // Bóng bay lơ lửng
  // ---------------------------------------------------------------------
  const balloons = Array.from({ length: 14 }, () => spawnBalloon(true));

  function spawnBalloon(initial) {
    const size = 24 + Math.random() * 26;
    return {
      x: Math.random() * width,
      y: initial ? height * (0.15 + Math.random()) : height + size * 1.5,
      size,
      speed: 0.25 + Math.random() * 0.5,
      sway: 8 + Math.random() * 18,
      swaySpeed: 0.4 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2,
      color: pick(COLORS),
      opacity: 0.55 + Math.random() * 0.35,
    };
  }

  function drawBalloon(b, t) {
    const swayX = Math.sin(t * b.swaySpeed + b.phase) * b.sway;
    const x = b.x + swayX;
    const y = b.y;
    const rx = b.size / 2;
    const ry = b.size * 0.6;
    ctx.save();
    ctx.globalAlpha = b.opacity;

    // Dây bóng, đuôi dây lắc ngược chiều thân bóng
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y + ry + 4);
    ctx.quadraticCurveTo(x - swayX * 0.4 + 6, y + ry + b.size * 0.7, x - swayX * 0.6, y + ry + b.size * 1.5);
    ctx.stroke();

    // Thân bóng + nút thắt
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.moveTo(x, y + ry - 1);
    ctx.lineTo(x - rx * 0.22, y + ry + 5);
    ctx.lineTo(x + rx * 0.22, y + ry + 5);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bóng tối và điểm sáng cho bóng có khối
    const shade = ctx.createRadialGradient(x + rx * 0.4, y + ry * 0.45, 0, x + rx * 0.4, y + ry * 0.45, rx * 1.4);
    shade.addColorStop(0, "rgba(20, 8, 50, 0.35)");
    shade.addColorStop(1, "rgba(20, 8, 50, 0)");
    ctx.fillStyle = shade;
    ctx.fill();

    const shine = ctx.createRadialGradient(x - rx * 0.35, y - ry * 0.4, 0, x - rx * 0.35, y - ry * 0.4, rx * 0.8);
    shine.addColorStop(0, "rgba(255, 255, 255, 0.7)");
    shine.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = shine;
    ctx.fill();
    ctx.restore();
  }

  // ---------------------------------------------------------------------
  // Pháo giấy (gọi qua window.burstAt và window.celebrate)
  // ---------------------------------------------------------------------
  let confetti = [];

  function spawnConfetti(x, y, angle, spread, power) {
    const a = angle + (Math.random() - 0.5) * spread;
    const v = power * (0.5 + Math.random() * 0.7);
    confetti.push({
      x,
      y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v,
      size: 5 + Math.random() * 6,
      color: pick([...COLORS, "#ffffff"]),
      shape: pick(["rect", "circle", "ribbon"]),
      rotation: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.3,
      flip: Math.random() * Math.PI * 2,
      life: 0,
      maxLife: 130 + Math.random() * 80,
    });
  }

  // Nổ pháo giấy toả ra từ một điểm
  window.burstAt = function (x, y, count) {
    for (let i = 0; i < (count || 60); i++) spawnConfetti(x, y, -Math.PI / 2, Math.PI * 2, 9);
  };

  // Bắn pháo giấy từ hai góc dưới màn hình trong một khoảng thời gian
  window.celebrate = function (durationMs) {
    window.burstAt(width / 2, height * 0.35, 100);
    const end = Date.now() + (durationMs || 3000);
    const timer = setInterval(() => {
      for (let i = 0; i < 10; i++) {
        spawnConfetti(0, height, -Math.PI / 3, 0.6, 20);
        spawnConfetti(width, height, (-2 * Math.PI) / 3, 0.6, 20);
      }
      if (Date.now() > end) clearInterval(timer);
    }, 280);
  };

  function drawConfetti() {
    confetti = confetti.filter((c) => c.life < c.maxLife && c.y < height + 40);
    if (confetti.length > 700) confetti.splice(0, confetti.length - 700);

    confetti.forEach((c) => {
      c.vx *= 0.985;
      c.vy = c.vy * 0.985 + 0.18;
      c.x += c.vx + Math.sin(c.life * 0.1 + c.flip) * 0.6;
      c.y += c.vy;
      c.rotation += c.vr;
      c.flip += 0.12;
      c.life += 1;

      ctx.save();
      ctx.globalAlpha = Math.min(1, (c.maxLife - c.life) / 30);
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rotation);
      ctx.scale(1, Math.cos(c.flip)); // lật qua lại như giấy thật
      ctx.fillStyle = c.color;
      if (c.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, c.size / 2.4, 0, Math.PI * 2);
        ctx.fill();
      } else if (c.shape === "ribbon") {
        ctx.fillRect(-c.size, -c.size / 5, c.size * 2, c.size / 2.5);
      } else {
        ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.7);
      }
      ctx.restore();
    });
  }

  // ---------------------------------------------------------------------
  // Vòng lặp render
  // ---------------------------------------------------------------------
  function tick(now) {
    const t = reduceMotion ? 0 : now / 1000;
    ctx.clearRect(0, 0, width, height);
    drawStars(t);
    balloons.forEach((b) => {
      if (!reduceMotion) b.y -= b.speed;
      if (b.y < -b.size * 2.2) Object.assign(b, spawnBalloon(false));
      drawBalloon(b, t);
    });
    drawConfetti();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // ---------------------------------------------------------------------
  // Bật/tắt nhạc nền
  // ---------------------------------------------------------------------
  const music = document.getElementById("bg-music");
  const musicToggle = document.getElementById("music-toggle");
  if (music && musicToggle) {
    const syncButton = () => {
      musicToggle.classList.toggle("playing", !music.paused);
      musicToggle.setAttribute("aria-label", music.paused ? "Bật nhạc" : "Tắt nhạc");
    };
    music.addEventListener("play", syncButton);
    music.addEventListener("pause", syncButton);

    musicToggle.addEventListener("click", () => {
      if (music.paused) {
        music.play().catch(() => {});
      } else {
        music.pause();
      }
    });

    // Trình duyệt thường chặn tự động phát có âm thanh cho tới khi người
    // dùng tương tác với trang, nên vừa thử autoplay vừa bắt lần tương tác
    // đầu tiên để phát nhạc ngay khi có thể.
    music.play().catch(() => {
      const startOnFirstInteraction = (e) => {
        document.removeEventListener("click", startOnFirstInteraction);
        document.removeEventListener("touchstart", startOnFirstInteraction);
        // Lần chạm đầu là vào nút nhạc thì để nút tự xử lý, tránh bật rồi tắt ngay
        if (musicToggle.contains(e.target)) return;
        music.play().catch(() => {});
      };
      document.addEventListener("click", startOnFirstInteraction);
      document.addEventListener("touchstart", startOnFirstInteraction);
    });
  }
})();
