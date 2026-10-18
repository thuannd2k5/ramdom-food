# THIẾT KẾ LUỒNG GIAO DIỆN (UI/UX FLOWS)
## Ứng dụng Mobile: Random Food (React Native Expo)

---

## 1. SƠ ĐỒ ĐIỀU HƯỚNG TỔNG QUAN (NAVIGATION GRAPH)

```mermaid
flowchart TD
    AppStart([Khởi động App]) --> CheckAuth{Đã đăng nhập?}
    CheckAuth -->|Chưa đăng nhập| Welcome[Màn hình Chào mừng / Login / Guest Mode]
    CheckAuth -->|Đã có Token| MainTabs[Màn hình Chính (Tabs)]
    Welcome -->|Bấm Dùng thử ngay| MainTabs
    Welcome -->|Đăng nhập / Đăng ký| MainTabs

    subgraph TabsNavigation ["Thanh điều hướng dưới (Bottom Tabs)"]
        Tab1[1. Random Wheel / Picker\n(Màn hình chính)]
        Tab2[2. Danh mục & Khám phá\n(Explore / Foods List)]
        Tab3[3. Yêu thích & Lịch sử\n(Favorites & History)]
        Tab4[4. Tài khoản\n(Profile / Settings)]
    end

    MainTabs --> TabsNavigation

    Tab1 -->|Bấm Nút 'Quay món'| RollingAnimation[Hiệu ứng Xáo trộn / Slot Machine]
    RollingAnimation --> ResultCard[Hiển thị Thẻ Món Ăn Trúng Thưởng]
    ResultCard -->|Bấm 'Tìm quán gần tôi'| NearbyPlaces[Màn hình Danh sách Quán ăn xung quanh GPS]
    ResultCard -->|Bấm 'Quay lại'| RollingAnimation
    ResultCard -->|Bấm 'Chốt món này'| SuccessFeedback[Lưu lịch sử & Chúc ngon miệng!]
    
    NearbyPlaces -->|Bấm vào quán| OpenExternalMap([Mở Google Maps Điều hướng])
```

---

## 2. CHI TIẾT CÁC MÀN HÌNH CHÍNH (SCREEN WIREFRAMES)

### 2.1. Màn hình Chào mừng & Đăng nhập (`/app/(auth)/login.tsx`)
- Logo thương hiệu Random Food vui nhộn.
- Khẩu hiệu: *"Không còn đau đầu vì câu hỏi Hôm nay ăn gì!"*
- 2 ô nhập: Email & Mật khẩu kèm nút **"Đăng nhập"**.
- Nút **"Tiếp tục với Google"** (Social Login).
- Nút bấm phụ: **"Trải nghiệm ngay không cần tài khoản"** (Guest Mode).

---

### 2.2. Màn hình Chính: Quay món ngẫu nhiên (`/app/(tabs)/index.tsx`)
- **Header:**
  - Lời chào theo buổi (Ví dụ: *"Chào buổi trưa, Thuận!"*).
  - Chip bộ lọc nhanh: `[Bữa trưa]` `[Dưới 50k]` `[Món nước]`.
- **Khu vực trung tâm (Center Stage):**
  - Trạng thái chờ: Hộp quà bí ẩn hoặc vòng tròn ngẫu nhiên nhấp nháy bắt mắt.
  - Trạng thái quay: Hình ảnh các món ăn lướt qua với tốc độ giảm dần (Slot machine shuffle effect) trong 1.5 - 2 giây.
  - Trạng thái trúng món (Result Card):
    + Hình ảnh món ăn full-width chất lượng cao.
    + Tên món (Font chữ lớn, nổi bật).
    + Khoảng giá (Ví dụ: `35.000đ - 50.000đ`).
    + Tag nhãn: `#Cơmvănphòng`, `#Khôngcay`, `#Nhanhgọn`.
    + Nút bấm hành động (Action Buttons):
      * 🎯 **"Chốt món này"** (Xác nhận ăn, cộng điểm/lưu lịch sử).
      * 📍 **"Tìm quán gần tôi"** (Mở tìm quán qua GPS).
      * 🔄 **"Quay món khác"** (Quay tiếp với animation mới).
      * ❤️ **Icon tim** (Lưu vào danh sách yêu thích).

---

### 2.3. Màn hình Quán ăn xung quanh (`/app/places/nearby.tsx`)
- Hiển thị vị trí hiện tại của người dùng và bán kính tìm kiếm (Slider: 1km - 3km).
- Danh sách thẻ quán ăn:
  - Tên quán (Ví dụ: *Bún Chả Nem Cầu Giấy*).
  - Khoảng cách từ vị trí hiện tại (Ví dụ: *Cách bạn 450m*).
  - Đánh giá (Rating sao ⭐ 4.6).
  - Nút **"Chỉ đường (Google Maps)"** một chạm.

---

### 2.4. Màn hình Yêu thích & Lịch sử (`/app/(tabs)/favorites.tsx`)
- Tab 1: **Món yêu thích** (Grid 2 cột hiển thị các món ăn người dùng đã tim).
- Tab 2: **Lịch sử ăn uống** (Timeline ghi nhận các ngày gần đây đã ăn món gì, tránh trùng lặp món cho cả tuần).
