# TÀI LIỆU YÊU CẦU DỰ ÁN (REQUIREMENTS SPECIFICATION)
## Dự án: Random Food App (Mobile)

---

## 1. TỔNG QUAN DỰ ÁN
- **Tên dự án:** Random Food (Ứng dụng gợi ý món ăn ngẫu nhiên & tìm kiếm quán ăn xung quanh)
- **Vấn đề giải quyết:** Tình trạng do dự, mất thời gian suy nghĩ *"Hôm nay ăn gì?"* của dân văn phòng vào giờ nghỉ trưa và sinh viên mỗi ngày.
- **Mục tiêu sản phẩm:** Cung cấp trải nghiệm chọn món nhanh chóng, ngẫu nhiên thú vị với hình ảnh hấp dẫn, kèm khả năng gợi ý quán ăn xung quanh dựa trên vị trí GPS thực tế.

---

## 2. ĐỐI TƯỢNG SỬ DỤNG (TARGET AUDIENCE)
1. **Dân văn phòng:**
   - Thời gian nghỉ trưa giới hạn (45 - 60 phút).
   - Nhu cầu: Cơm trưa nhanh, quán gần công ty (bán kính < 2km), thực đơn đổi mới mỗi ngày, phân khúc giá vừa phải (35k - 65k).
2. **Sinh viên:**
   - Ngân sách tiết kiệm, nhạy cảm về giá (20k - 40k).
   - Nhu cầu: Tìm món ăn vặt, trà sữa, quán ăn bình dân gần trường/ký túc xá.
3. **Người dùng chung:**
   - Nhóm bạn bè, cặp đôi thường xuyên bế tắc khi chọn địa điểm ăn uống.

---

## 3. PHẠM VI TÍNH NĂNG MVP (MINIMUM VIABLE PRODUCT)

### 3.1. Tính năng cốt lõi (Core Features)
1. **Quay chọn món ngẫu nhiên (Random Slot/Shuffle):**
   - Nút bấm tạo hiệu ứng quay/xáo trộn ngẫu nhiên sinh động.
   - Dừng lại và hiển thị thẻ món ăn: Ảnh chất lượng cao, tên món, khoảng giá ước tính, phân loại (Món nước / Món khô / Cơm / Ăn vặt).
   - Tùy chọn: "Chọn món này" hoặc "Quay lại món khác".
2. **Bộ lọc thông minh (Smart Filters):**
   - Theo bữa ăn: Bữa sáng, Bữa trưa, Bữa tối, Ăn vặt/Tráng miệng.
   - Theo ngân sách: Dưới 30k, 30k - 60k, Trên 60k.
   - Theo khẩu vị/đặc tính: Cay / Không cay, Món nước / Món khô, Ăn chay.
3. **Tìm quán ăn xung quanh dựa trên GPS (Nearby Restaurants):**
   - Tự động lấy tọa độ hiện tại của thiết bị qua GPS (`expo-location`).
   - Tích hợp API tìm kiếm quán bán món ăn vừa quay được trong bán kính cấu hình (1km - 5km).
   - Nút 1-chạm: Mở trực tiếp ứng dụng bản đồ Google Maps / Apple Maps để chỉ đường tới quán.
4. **Xác thực người dùng (Authentication):**
   - Đăng ký và Đăng nhập bằng Email/Password (có mã hóa mật khẩu bcrypt, cấp JWT token).
   - Đăng nhập nhanh bằng Google OAuth.
   - Hỗ trợ chế độ dùng thử (Guest Mode) để người dùng có thể trải nghiệm quay món ngay mà không bị rào cản đăng nhập.
5. **Quản lý danh sách & Lịch sử cá nhân:**
   - Lưu các món ăn yêu thích (Favorites).
   - Xem lịch sử các món đã quay và đã chọn trong 7 ngày gần nhất.

---

## 4. YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS)
- **Hiệu năng:** Thời gian quay và trả lời kết quả ngẫu nhiên < 500ms.
- **Giao diện & Trải nghiệm (UI/UX):**
  - Tối ưu hiển thị cho màn hình di động (iOS & Android).
  - Tải ảnh món ăn mượt mà (sử dụng placeholder, caching ảnh).
  - Hoạt ảnh (animation) quay mượt mà ở tần số quét 60fps.
- **Bảo mật:**
  - Mật khẩu người dùng băm bằng `bcrypt` với salt rounds chuẩn (>= 10).
  - Token xác thực JWT có thời hạn hợp lý.
  - Tuyệt đối không hardcode database credentials hay secret keys vào mã nguồn frontend.
  - Toàn bộ dữ liệu gửi qua API phải được kiểm tra tính hợp lệ (Validation).
- **Độ tin cậy:**
  - Ứng dụng xử lý tình huống mất kết nối mạng hoặc người dùng từ chối cấp quyền GPS một cách thân thiện (fallback nhập địa chỉ hoặc gợi ý chung).

---

## 5. CÁC TÍNH NĂNG MỞ RỘNG TRONG TƯƠNG LAI (POST-MVP)
- Vòng quay may mắn tùy chỉnh (người dùng tự tạo danh sách món riêng và quay).
- Phòng quay chung (Room Random): Mời đồng nghiệp trong công ty cùng join một room, mỗi người vote hoặc quay chung một kết quả.
- Đánh giá quán ăn và chia sẻ công thức nấu ăn.
