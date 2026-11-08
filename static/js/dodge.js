(function () {
  const btnNo = document.getElementById("btn-no");
  const btnYes = document.getElementById("btn-yes");
  if (!btnNo) return;

  // Mỗi lần né, nút đổi một câu cho vui
  const taunts = ["Chắc chưa? 🤔", "Nghĩ lại đi mà 🥺", "Bắt được đâu 😝", "Có bánh kem đó 🎂", "Không được đâu 🙅", "Đi đi mà 🙏"];
  let dodges = 0;

  function dodge() {
    // Thẻ cha có backdrop-filter sẽ khiến position: fixed tính theo thẻ đó
    // thay vì màn hình, nên đưa nút ra thẳng body trước khi cho nó chạy
    if (btnNo.parentElement !== document.body) document.body.appendChild(btnNo);
    btnNo.classList.add("dodging");
    btnNo.textContent = taunts[dodges % taunts.length];
    dodges++;

    const margin = 16;
    const maxLeft = window.innerWidth - btnNo.offsetWidth - margin;
    const maxTop = window.innerHeight - btnNo.offsetHeight - margin;
    btnNo.style.left = margin + Math.random() * Math.max(0, maxLeft - margin) + "px";
    btnNo.style.top = margin + Math.random() * Math.max(0, maxTop - margin) + "px";

    // Nút "Đi chứ!" ngày càng to hơn để càng lúc càng dễ chọn
    if (btnYes) btnYes.style.scale = String(1 + Math.min(dodges, 6) * 0.08);
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
})();
