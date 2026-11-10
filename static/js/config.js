const CONFIG = {
  hostName: "Mình",
  // Thời điểm bắt đầu tiệc theo giờ Việt Nam, dạng năm-tháng-ngàyTgiờ:phút.
  // Dùng để hiện ngày giờ, đếm ngược và tạo link thêm vào Google Calendar.
  partyDate: "2026-11-24T18:30",
  question: "Bạn đến chung vui cùng mình nhé?",
  // Vài nhà hàng gợi ý sẵn (không bắt buộc). Quán khách gợi ý sẽ tự được
  // thêm vào danh sách cho người sau chọn, cần cấu hình scriptUrl.
  restaurants: [
    "🔥 Nướng",
    "🍷 Fine-Dining",
    "🍲 Lẩu",
    "🍱 Buffet",
    "🦐 Hải sản",
    "🍣 Đồ Nhật",
  ],
  activities: [
    { id: "karaoke", emoji: "🎤", label: "Karaoke" },
    { id: "boardgame", emoji: "🎲", label: "Board game" },
    { id: "cafe", emoji: "☕", label: "Cà phê" },
    { id: "other", emoji: "✨", label: "Hoạt động khác", custom: true },
  ],
  // Dán Web app URL của Google Apps Script vào đây sau khi deploy (xem README.md).
  // Để trống nếu không cần ghi lại câu trả lời.
  scriptUrl: "https://script.google.com/macros/s/AKfycbyC-qOu7a35EBfR6UjJ_TSdV4-8Ee2X84WpBVs3QuAf42akSI69te1hJycjRFGx_Xpj/exec",
};
