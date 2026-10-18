# ĐẶC TẢ REST API (API SPECIFICATION)
## Base URL: `http://localhost:3000/api/v1` (Dev) hoặc `http://192.168.1.3:3000/api/v1` (Mobile Dev)

Tất cả response đều tuân theo cấu trúc JSON chuẩn:
- **Thành công:**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "data": { ... },
    "message": "Thao tác thành công"
  }
  ```
- **Thất bại:**
  ```json
  {
    "success": false,
    "statusCode": 400,
    "error": "Bad Request",
    "message": "Validation failed: email must be a valid email",
    "timestamp": "2026-10-18T14:45:00.000Z"
  }
  ```

---

## 1. AUTHENTICATION MODULE (`/auth`)

### 1.1. Đăng ký tài khoản (Register)
- **Endpoint:** `POST /auth/register`
- **Quyền truy cập:** Public
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!",
    "fullName": "Nguyễn Văn A"
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "statusCode": 201,
    "data": {
      "user": {
        "id": "67123abc...",
        "email": "user@example.com",
        "fullName": "Nguyễn Văn A"
      },
      "accessToken": "eyJhbGciOiJIUzI1Ni..."
    }
  }
  ```

### 1.2. Đăng nhập Email/Password (Login)
- **Endpoint:** `POST /auth/login`
- **Quyền truy cập:** Public
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "user": { "id": "...", "email": "...", "fullName": "..." },
      "accessToken": "eyJhbGciOi..."
    }
  }
  ```

### 1.3. Đăng nhập Google (Google OAuth)
- **Endpoint:** `POST /auth/google`
- **Quyền truy cập:** Public
- **Request Body:**
  ```json
  {
    "idToken": "eyJhbGciOi..."
  }
  ```
- **Response `200 OK`:** Trả về User thông tin và `accessToken`.

---

## 2. FOODS & RANDOM MODULE (`/foods`)

### 2.1. Quay món ăn ngẫu nhiên (Core Engine)
- **Endpoint:** `GET /foods/random`
- **Quyền truy cập:** Public (Hỗ trợ cả Guest và User có token)
- **Query Parameters:**
  - `mealType` (optional, string): `breakfast` | `lunch` | `dinner` | `snack`
  - `maxPrice` (optional, number): Lọc món có giá tối đa không vượt quá mức này
  - `tag` (optional, string): `spicy` | `non_spicy` | `soup` | `dry`
  - `categoryId` (optional, string): Lọc theo danh mục
  - `excludeIds` (optional, string): Danh sách các ID món đã quay trước đó để tránh trùng lặp liên tiếp: `id1,id2`
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "id": "67123def...",
      "name": "Cơm sườn nướng mật ong",
      "slug": "com-suon-nuong-mat-ong",
      "description": "Cơm tấm nóng hổi ăn kèm sườn cốt lết nướng mật ong vàng ruộm, nước mắm ớt tỏi.",
      "imageUrl": "https://images.unsplash.com/photo-...",
      "priceMin": 40000,
      "priceMax": 55000,
      "mealTypes": ["lunch", "dinner"],
      "tags": ["dry", "office_friendly", "non_spicy"],
      "category": {
        "id": "...",
        "name": "Cơm"
      }
    }
  }
  ```

### 2.2. Danh sách tất cả món ăn (Có phân trang & tìm kiếm)
- **Endpoint:** `GET /foods`
- **Query Parameters:** `page=1&limit=20&keyword=com&categoryId=...`
- **Response `200 OK`:** Trả về danh sách món và thông tin phân trang `pagination: { page, limit, total }`.

### 2.3. Chi tiết món ăn
- **Endpoint:** `GET /foods/:id`
- **Response `200 OK`:** Thông tin chi tiết món ăn, các quán ăn gợi ý phổ biến cho món này.

---

## 3. PLACES & GPS MODULE (`/places`)

### 3.1. Tìm quán ăn xung quanh theo vị trí GPS
- **Endpoint:** `GET /places/nearby`
- **Query Parameters:**
  - `lat` (required, float): Vĩ độ của người dùng (ví dụ: `21.028511`)
  - `lng` (required, float): Kinh độ của người dùng (ví dụ: `105.854444`)
  - `foodName` (required, string): Tên món ăn cần tìm (ví dụ: `Bún chả`)
  - `radius` (optional, int): Bán kính mét (mặc định: `2000` = 2km)
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": [
      {
        "name": "Bún Chả Hương Liên (Obama)",
        "address": "24 Lê Văn Hưu, Hai Bà Trưng, Hà Nội",
        "distance": 850,
        "rating": 4.5,
        "lat": 21.0182,
        "lng": 105.8541,
        "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=21.0182,105.8541"
      }
    ]
  }
  ```

---

## 4. FAVORITES & HISTORY MODULE (`/users/favorites`, `/history`)

### 4.1. Thêm/Xóa món ăn yêu thích (Toggle Favorite)
- **Endpoint:** `POST /users/favorites/:foodId`
- **Quyền truy cập:** Yêu cầu Bearer Token (`JwtAuthGuard`)
- **Response `200 OK`:** Trạng thái `{ isFavorited: true | false }`.

### 4.2. Lấy danh sách món yêu thích của người dùng
- **Endpoint:** `GET /users/favorites`
- **Quyền truy cập:** Yêu cầu Bearer Token
- **Response `200 OK`:** Danh sách các món ăn đã bookmark kèm thông tin danh mục.

### 4.3. Ghi nhận lựa chọn ăn món này (Accept Roll)
- **Endpoint:** `POST /history/accept`
- **Request Body:** `{ "foodId": "67123def..." }`
- **Response `200 OK`:** `{ "success": true, "message": "Đã lưu lịch sử bữa ăn" }`.
