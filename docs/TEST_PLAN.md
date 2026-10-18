# KẾ HOẠCH KIỂM THỬ (TEST PLAN & TDD STRATEGY)
## Dự án: Random Food App

---

## 1. NGUYÊN TẮC KIỂM THỬ (CORE PRINCIPLES)
1. **Kiểm thử theo phương pháp TDD (Test-Driven Development):**
   - Với các logic nghiệp vụ quan trọng (thuật toán random món ăn, bộ lọc giá/bữa ăn, auth validation, hashing mật khẩu): Viết test trước -> Chạy test (Red) -> Viết code tối thiểu để pass (Green) -> Refactor (Clean).
2. **Bằng chứng trước khẳng định (Evidence before assertions):**
   - Tuyệt đối không tuyên bố một tính năng hay bugfix đã hoàn thành nếu chưa chạy lệnh kiểm thử thực tế trên terminal và có output xác nhận pass 100%.
3. **Phân cấp tầng kiểm thử:**
   - **Tầng 1 - Unit Tests:** Kiểm thử từng hàm, Service độc lập (mock Repository/Database). Chạy cực nhanh (< 5 giây).
   - **Tầng 2 - Integration / E2E Tests:** Khởi động ứng dụng NestJS test module, gửi HTTP request giả lập qua Supertest và kiểm tra phản hồi JSON, mã lỗi HTTP.
   - **Tầng 3 - Client Verification:** Kiểm thử giao diện và tương tác trên Expo Go.

---

## 2. MA TRẬN KIỂM THỬ BACKEND (NESTJS)

| Module | Đối tượng kiểm thử | Loại kiểm thử | Tiêu chí nghiệm thu |
| :--- | :--- | :--- | :--- |
| **Auth** | `AuthService.register()` | Unit Test | Băm mật khẩu đúng, không lưu password plain-text, trả về user + JWT |
| **Auth** | `AuthService.login()` | Unit Test | Sai password trả về Unauthorized 401; đúng password trả về JWT |
| **Auth** | `POST /auth/register` | E2E Test | Validate email sai định dạng trả về 400 Bad Request kèm message rõ ràng |
| **Foods** | `FoodsService.getRandomFood()` | Unit Test | Trả về 1 món duy nhất thỏa mãn tất cả tiêu chí filter (giá, bữa, tag) |
| **Foods** | `FoodsService.getRandomFood()` (Empty) | Unit Test | Khi không có món nào thỏa mãn bộ lọc khắt khe, trả về gợi ý dự phòng hoặc 404 thân thiện |
| **Foods** | `GET /foods/random` | E2E Test | Endpoint public, thời gian phản hồi < 200ms |
| **Places** | `PlacesService.getNearby()` | Unit Test | Nhận tọa độ GPS, tính toán khoảng cách theo mét và sort từ gần đến xa |
| **Users** | `UsersService.toggleFavorite()` | Unit Test | Thêm món vào bookmark nếu chưa có, bỏ bookmark nếu đã có |

---

## 3. CÁC LỆNH CHẠY KIỂM THỬ THỰC TẾ
Các lệnh này sẽ được cấu hình trong `apps/backend/package.json` và chạy trực tiếp qua `npm.cmd`:

```bash
# Chạy Unit Tests
npm.cmd test -- --passWithNoTests

# Chạy Unit Tests ở chế độ theo dõi (Watch Mode) khi lập trình TDD
npm.cmd run test:watch

# Chạy E2E Tests (Integration)
npm.cmd run test:e2e

# Đo độ phủ kiểm thử (Test Coverage)
npm.cmd run test:cov
```
*Mục tiêu độ phủ kiểm thử (Coverage Target): >= 80% cho toàn bộ Service nghiệp vụ.*
