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
  // Bóng bay lơ lửng nền
  // ---------------------------------------------------------------------
  const balloonColors = ["#f472b6", "#facc15", "#60a5fa", "#34d399", "#a78bfa", "#fb923c"];
  const balloons = Array.from({ length: 18 }, spawnBalloon);

  function spawnBalloon() {
    return {
      x: Math.random() * width,
      y: height + Math.random() * height,
      size: 16 + Math.random() * 18,
      speed: 0.4 + Math.random() * 0.8,
      drift: (Math.random() - 0.5) * 0.6,
      opacity: 0.4 + Math.random() * 0.35,
      color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
    };
  }

  function drawBalloon(b) {
    const rx = b.size / 2;
    const ry = b.size * 0.62;
    ctx.save();
    ctx.globalAlpha = b.opacity;

    // Dây bóng
    ctx.strokeStyle = "rgba(76, 29, 149, 0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(b.x, b.y + ry);
    ctx.quadraticCurveTo(b.x - rx * 0.6, b.y + ry + b.size * 0.6, b.x, b.y + ry + b.size * 1.2);
    ctx.stroke();

    // Thân bóng + nút thắt
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.ellipse(b.x, b.y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(b.x, b.y + ry - 1);
    ctx.lineTo(b.x - rx * 0.25, b.y + ry + rx * 0.35);
    ctx.lineTo(b.x + rx * 0.25, b.y + ry + rx * 0.35);
    ctx.closePath();
    ctx.fill();

    // Điểm sáng
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.beginPath();
    ctx.ellipse(b.x - rx * 0.35, b.y - ry * 0.35, rx * 0.2, ry * 0.25, -0.5, 0, Math.PI * 2);
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

    balloons.forEach((b) => {
      b.y -= b.speed;
      b.x += b.drift;
      if (b.y < -b.size * 2) Object.assign(b, spawnBalloon(), { y: height + 20 });
      drawBalloon(b);
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
