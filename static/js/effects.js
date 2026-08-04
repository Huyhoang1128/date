(function () {
  const canvas = document.getElementById("fx-canvas");
  const ctx = canvas.getContext("2d");
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  // ---------------------------------------------------------------------
  // Trái tim bay lơ lửng nền
  // ---------------------------------------------------------------------
  const hearts = Array.from({ length: 18 }, spawnHeart);

  function spawnHeart() {
    return {
      x: Math.random() * width,
      y: height + Math.random() * height,
      size: 10 + Math.random() * 18,
      speed: 0.4 + Math.random() * 0.8,
      drift: (Math.random() - 0.5) * 0.6,
      opacity: 0.3 + Math.random() * 0.4,
    };
  }

  function drawHeart(x, y, size, opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = "#f472b6";
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.4, x, y + size);
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.4, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.fill();
    ctx.restore();
  }

  // ---------------------------------------------------------------------
  // Confetti bùng nổ (gọi qua window.celebrate)
  // ---------------------------------------------------------------------
  let confetti = [];
  const confettiColors = ["#f472b6", "#facc15", "#60a5fa", "#34d399", "#a78bfa"];

  function burstConfetti(count) {
    for (let i = 0; i < count; i++) {
      confetti.push({
        x: width / 2,
        y: height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 10 - 4,
        size: 4 + Math.random() * 5,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        life: 0,
      });
    }
  }

  window.celebrate = function (durationMs) {
    const end = Date.now() + (durationMs || 3000);
    const interval = setInterval(() => {
      burstConfetti(20);
      if (Date.now() > end) clearInterval(interval);
    }, 250);
  };

  // ---------------------------------------------------------------------
  // Vòng lặp render
  // ---------------------------------------------------------------------
  function tick() {
    ctx.clearRect(0, 0, width, height);

    hearts.forEach((h) => {
      h.y -= h.speed;
      h.x += h.drift;
      if (h.y < -20) Object.assign(h, spawnHeart(), { y: height + 20 });
      drawHeart(h.x, h.y, h.size, h.opacity);
    });

    confetti = confetti.filter((c) => c.life < 150);
    confetti.forEach((c) => {
      c.vy += 0.25;
      c.x += c.vx;
      c.y += c.vy;
      c.rotation += c.vr;
      c.life += 1;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - c.life / 150);
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rotation);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
      ctx.restore();
    });

    requestAnimationFrame(tick);
  }
  tick();

  // ---------------------------------------------------------------------
  // Bật/tắt nhạc nền
  // ---------------------------------------------------------------------
  const music = document.getElementById("bg-music");
  const musicToggle = document.getElementById("music-toggle");
  if (music && musicToggle) {
    music.addEventListener("play", () => (musicToggle.textContent = "🔊"));
    music.addEventListener("pause", () => (musicToggle.textContent = "🔇"));

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
      const startOnFirstInteraction = () => {
        music.play().catch(() => {});
        document.removeEventListener("click", startOnFirstInteraction);
        document.removeEventListener("touchstart", startOnFirstInteraction);
      };
      document.addEventListener("click", startOnFirstInteraction);
      document.addEventListener("touchstart", startOnFirstInteraction);
    });
  }
})();
