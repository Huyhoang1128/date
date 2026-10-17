const CONFIG = {
  hostName: "Mình",
  // Thời gian bữa tiệc, hiện ở trang đầu và trang xác nhận
  partyTime: "18:30, Thứ 3, 24/11/2026",
  question: "Bạn đến chung vui cùng mình nhé?",
  // Vài nhà hàng gợi ý sẵn (không bắt buộc). Quán khách gợi ý sẽ tự được
  // thêm vào danh sách cho người sau chọn, cần cấu hình scriptUrl.
  restaurants: [],
  activities: [
    { id: "karaoke", label: "🎤 Karaoke", emoji: "🎤" },
    { id: "boardgame", label: "🎲 Board game", emoji: "🎲" },
    { id: "cafe", label: "☕ Cà phê", emoji: "☕" },
    { id: "other", label: "✨ Hoạt động khác", emoji: "✨", custom: true },
  ],
  // Dán Web app URL của Google Apps Script vào đây sau khi deploy (xem README.md).
  // Để trống nếu không cần ghi lại câu trả lời.
  scriptUrl: "https://script.google.com/macros/s/AKfycbyC-qOu7a35EBfR6UjJ_TSdV4-8Ee2X84WpBVs3QuAf42akSI69te1hJycjRFGx_Xpj/exec",
};
