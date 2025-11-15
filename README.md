# 🌍 TravelBook – Website Đặt Tour Du Lịch Đơn Giản

Website đặt tour du lịch được xây dựng với Next.js, TypeScript và Tailwind CSS.

## 🎯 Mục tiêu

Xây dựng một website cho phép người dùng:

- **Xem danh sách tour du lịch**: Duyệt qua danh sách tour, tìm kiếm theo điểm đến, giá cả
- **Xem chi tiết từng tour**: Xem đầy đủ thông tin tour bao gồm lịch trình, dịch vụ, giá cả
- **Đặt tour / gửi yêu cầu tư vấn**: Đặt tour trực tiếp trên website, không cần đăng nhập
- **Quản lý đặt tour bên admin**: Admin quản lý tours và bookings một cách dễ dàng

## 🚀 Tính năng

### Trang công khai
- **Danh sách tour**: Xem tất cả tours với tìm kiếm và lọc
- **Chi tiết tour**: Xem đầy đủ thông tin tour, hình ảnh, lịch trình
- **Đặt tour**: Form đặt tour đơn giản, tự động tính giá
- **Responsive**: Hoạt động tốt trên mọi thiết bị

### Bảng điều khiển Admin
- **Quản lý tours**: Thêm, sửa, xóa tours
- **Quản lý bookings**: Xem danh sách đặt tour, cập nhật trạng thái
- **Quản lý số chỗ trống**: Tự động cập nhật khi có đặt tour
- **Thống kê**: Xem số liệu về tours và bookings

## 🛠️ Công nghệ sử dụng

- **Framework**: Next.js 15.2.3
- **Ngôn ngữ**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **Database**: PostgreSQL với Prisma ORM
- **State Management**: Zustand, TanStack Query
- **UI Components**: Custom components với Tailwind CSS
- **Icons**: Custom SVG icons

## 📦 Cài đặt

### 1. Yêu cầu hệ thống
- Node.js 18+ 
- PostgreSQL 14+ (chạy local)
- npm hoặc yarn

### 2. Cài đặt PostgreSQL Local

**macOS (với Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14
createdb travelbook
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb travelbook
```

**Windows:**
- Tải và cài đặt PostgreSQL từ [postgresql.org](https://www.postgresql.org/download/windows/)
- Tạo database `travelbook` bằng pgAdmin hoặc psql

### 3. Clone và cài đặt dependencies

```bash
git clone <repository-url>
cd TravelBook
npm install
# hoặc
yarn install
```

### 4. Thiết lập môi trường

Tạo file `.env.local` trong thư mục gốc:

```env
# Database - PostgreSQL Local
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/travelbook?schema=public"

# JWT Secret - Tạo một chuỗi ngẫu nhiên
# Có thể dùng: openssl rand -base64 32
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

**Lưu ý:** Thay đổi `postgres:postgres` thành username và password PostgreSQL của bạn.

### 5. Chạy Migration và Seed

```bash
# Tạo migration
npm run prisma:migrate
# hoặc
yarn prisma:migrate dev --name init_travelbook

# Seed dữ liệu mẫu (tùy chọn)
npm run prisma:seed
# hoặc
yarn prisma:seed
```

### 6. Chạy Development Server

```bash
npm run dev
# hoặc
yarn dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

## 🌐 Routes

### Routes Công khai
- `/` - Trang chủ
- `/tours` - Danh sách tour
- `/tours/[id]` - Chi tiết tour

### Routes Admin
- `/admin` - Bảng điều khiển Admin
- `/admin/tours` - Quản lý tours (cần tạo)
- `/admin/bookings` - Quản lý bookings (cần tạo)

### Routes API
- `GET /api/tours` - Lấy danh sách tours (public)
- `GET /api/tours/[id]` - Lấy chi tiết tour (public)
- `POST /api/tours` - Tạo tour mới (admin only)
- `PUT /api/tours/[id]` - Cập nhật tour (admin only)
- `DELETE /api/tours/[id]` - Xóa tour (admin only)
- `GET /api/bookings` - Lấy danh sách bookings (authenticated)
- `POST /api/bookings` - Tạo booking mới (public)
- `GET /api/bookings/[id]` - Lấy chi tiết booking (authenticated)
- `PUT /api/bookings/[id]` - Cập nhật booking (admin hoặc owner)
- `DELETE /api/bookings/[id]` - Hủy booking (admin hoặc owner)
- `GET /api/admin/statistics` - Thống kê (admin only)
- `GET /api/admin/users` - Danh sách users (admin only)

## 🎨 Hỗ trợ Theme

TravelBook hỗ trợ cả theme sáng và tối:
- Chuyển đổi theme bằng công tắc theme trong header
- Tùy chọn theme được lưu tự động
- Chế độ tối được tối ưu hóa để đọc tốt hơn

## 📱 Thiết kế Responsive

Nền tảng hoàn toàn responsive và hoạt động mượt mà trên:
- Desktop (1920px trở lên)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔧 Cấu hình Database

### PostgreSQL Local Setup

1. **Tạo database:**
```sql
CREATE DATABASE travelbook;
```

2. **Kiểm tra kết nối:**
```bash
psql -U postgres -d travelbook
```

3. **Cấu hình DATABASE_URL:**
```
postgresql://USERNAME:PASSWORD@localhost:5432/travelbook?schema=public
```

### Cấu hình Tailwind

Dự án sử dụng Tailwind CSS v4 với cấu hình theme tùy chỉnh trong `src/app/globals.css`.

## 📂 Cấu trúc dự án

```
TravelBook/
├── public/
│   └── images/          # Hình ảnh và tài sản tĩnh
├── prisma/
│   ├── schema.prisma    # Schema cơ sở dữ liệu
│   └── seed.ts         # Dữ liệu mẫu
├── src/
│   ├── app/
│   │   ├── admin/        # Routes quản trị viên
│   │   ├── tours/        # Routes tours (public)
│   │   ├── api/          # API routes
│   │   │   ├── auth/     # Authentication
│   │   │   ├── tours/    # Tours API
│   │   │   ├── bookings/ # Bookings API
│   │   │   └── admin/    # Admin API
│   │   ├── layout.tsx    # Layout gốc
│   │   ├── page.tsx      # Trang chủ
│   │   ├── not-found.tsx # Trang 404
│   │   └── globals.css   # Styles toàn cục
│   ├── components/
│   │   ├── auth/         # Thành phần xác thực
│   │   ├── form/         # Thành phần form
│   │   ├── ui/           # Thành phần UI
│   │   └── ...
│   ├── context/
│   │   ├── ThemeContext.tsx    # Quản lý trạng thái theme
│   │   └── ToastContext.tsx    # Quản lý toast notifications
│   ├── hooks/            # React hooks tùy chỉnh
│   ├── lib/
│   │   ├── prisma.ts     # Prisma client
│   │   ├── jwt.ts        # JWT utilities
│   │   └── ...
│   └── middleware.ts     # Next.js middleware
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

## 🚦 Scripts có sẵn

- `npm run dev` - Khởi động development server
- `npm run build` - Build cho production
- `npm run start` - Khởi động production server
- `npm run lint` - Chạy ESLint
- `npm run prisma:generate` - Tạo Prisma client
- `npm run prisma:migrate` - Chạy migration
- `npm run prisma:seed` - Seed dữ liệu mẫu

## 🎯 Tính năng chính

### Kiểm soát truy cập dựa trên vai trò
- Người dùng công khai: Xem và đặt tour
- Khách hàng (khach_hang): Xem và quản lý bookings của mình
- Admin (admin): Quản lý tours và bookings

### Quản lý Tours
- Thêm, sửa, xóa tours
- Upload hình ảnh
- Quản lý số chỗ trống
- Cập nhật trạng thái (đang bán, tạm dừng, hết chỗ)

### Quản lý Bookings
- Xem danh sách đặt tour
- Cập nhật trạng thái (chờ xác nhận, đã xác nhận, đã hủy, đã hoàn tất)
- Tự động tính giá và kiểm tra số chỗ trống

## 🗄️ Cơ sở dữ liệu

### Schema chính
- **NguoiDung**: Thông tin người dùng (khách hàng, admin)
- **Tour**: Thông tin tour du lịch
- **TourImage**: Hình ảnh của tour
- **Booking**: Đặt tour
- **ThongBao**: Thông báo hệ thống
- **Token**: Token xác thực

### Dữ liệu mẫu
Seeder tạo ra:
- 1 admin user (admin@travelbook.com / admin123)
- 3 customer users
- 3 sample tours (Đà Lạt, Phú Quốc, Sapa)
- 2 sample bookings
- Notifications

## 🔐 Xác thực

Nền tảng bao gồm các trang xác thực:
- Đăng nhập: `/login`
- Đăng ký: `/register`

**Credentials mẫu (sau khi seed):**
- Admin: `admin@travelbook.com` / `admin123`
- Customer: `khach1@example.com` / `123456`

## 🤝 Đóng góp

1. Fork repository
2. Tạo branch tính năng (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 Giấy phép

Dự án này được cấp phép theo Giấy phép MIT.

## 👥 Hỗ trợ

Để được hỗ trợ và câu hỏi:
- Tạo issue trong repository
- Liên hệ nhóm phát triển

## 🙏 Lời cảm ơn

- Được xây dựng trên Next.js
- Tailwind CSS cho framework styling
- Prisma cho ORM

---

**TravelBook** - Khám phá thế giới, đặt tour dễ dàng.
