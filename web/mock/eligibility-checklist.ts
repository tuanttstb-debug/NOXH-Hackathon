import type { ChecklistItem } from "@/types/chat";

/**
 * Checklist chuẩn bị hồ sơ.
 * Cập nhật 2026-07-19: mục xác nhận nhà ở đã đối chiếu toàn văn NĐ 100/2024 Điều 29 (cả 2 khoản)
 * và Thông tư 08/2026 về mẫu đơn — trước đó chỉ nêu đường "chưa có nhà", bỏ sót đường "đã có nhà
 * nhưng diện tích bình quân dưới 15 m²/người", nên đưa SAI danh mục giấy tờ cho nhóm này.
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
    detail:
      "Nếu CHƯA có nhà: Văn phòng đăng ký đất đai cấp huyện xác nhận không có tên trong Giấy chứng nhận tại tỉnh nơi có dự án (Điều 29 khoản 1 NĐ 100/2024, sửa bởi NĐ 54/2026). Nếu ĐÃ có nhà nhưng diện tích bình quân dưới 15 m² sàn/người: UBND cấp xã xác nhận diện tích bình quân (Điều 29 khoản 2 NĐ 100/2024). Cả hai đều có thời hạn xử lý 07 ngày.",
  },
  {
    id: "don-dang-ky",
    label: "Đơn đăng ký mua/thuê mua NOXH",
    detail:
      "Theo mẫu tại Phụ lục Thông tư 05/2024/TT-BXD (đã sửa bởi TT 32/2025 và TT 08/2026), nộp tại chủ đầu tư dự án hoặc cơ quan tiếp nhận hồ sơ. Người thu nhập thấp tại đô thị không có hợp đồng lao động và không hưởng lương hưu dùng Mẫu số 05.",
  },
];
