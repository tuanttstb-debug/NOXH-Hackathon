import type { ChecklistItem } from "@/types/chat";

/**
 * Checklist chuẩn bị hồ sơ — nội dung tham khảo thực tế, chưa đối chiếu văn bản gốc
 * (cùng trạng thái "đang xác minh" như dữ liệu ở mock/legal-documents.ts).
 */
export const eligibilityChecklist: ChecklistItem[] = [
  {
    id: "cccd",
    label: "CMND/CCCD còn hiệu lực",
    detail: "Bản sao có chứng thực hoặc mang bản gốc để đối chiếu.",
  },
  {
    id: "xac-nhan-thu-nhap",
    label: "Giấy xác nhận thu nhập",
    detail:
      "Theo NĐ 54/2026, thẩm quyền xác nhận đã chuyển từ UBND cấp xã sang Công an cấp xã.",
  },
  {
    id: "xac-nhan-nha-o",
    label: "Giấy xác nhận tình trạng nhà ở",
    detail: "Xác nhận chưa có nhà ở thuộc sở hữu tại nơi có dự án NOXH (Điều 29 NĐ 100/2024).",
  },
  {
    id: "don-dang-ky",
    label: "Đơn đăng ký mua/thuê mua NOXH",
    detail: "Theo mẫu quy định, nộp tại chủ đầu tư dự án hoặc cơ quan tiếp nhận hồ sơ.",
  },
];
