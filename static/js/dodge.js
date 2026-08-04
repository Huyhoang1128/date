(function () {
  const btnNo = document.getElementById("btn-no");
  const btnYes = document.getElementById("btn-yes");
  if (!btnNo) return;

  function dodge() {
    const margin = 16;
    const maxLeft = window.innerWidth - btnNo.offsetWidth - margin;
    const maxTop = window.innerHeight - btnNo.offsetHeight - margin;
    const left = margin + Math.random() * Math.max(0, maxLeft - margin);
    const top = margin + Math.random() * Math.max(0, maxTop - margin);

    btnNo.classList.add("dodging");
    btnNo.style.left = left + "px";
    btnNo.style.top = top + "px";
  }

  btnNo.addEventListener("mouseenter", dodge);
  btnNo.addEventListener("touchstart", (e) => {
    e.preventDefault();
    dodge();
  }, { passive: false });
  btnNo.addEventListener("click", (e) => {
    e.preventDefault();
    dodge();
  });

  // Nút "Có" ngày càng to hơn theo mỗi lần né để càng lúc càng dễ chọn
  let growCount = 0;
  btnNo.addEventListener("mouseenter", () => {
    growCount = Math.min(growCount + 1, 6);
    if (btnYes) btnYes.style.transform = `scale(${1 + growCount * 0.08})`;
  });
})();
