# PMA Frontend - Hệ thống Quản lý Nhà thuốc

Giao diện người dùng cho hệ thống quản lý nhà thuốc (Pharmacy Management Application) xây dựng theo kiến trúc microservices.

## Công nghệ sử dụng

- **React 19** - UI Framework
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Axios** - HTTP Client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Toastify** - Notifications

## Cấu trúc dự án

```
src/
├── components/          # Các component tái sử dụng
│   ├── common/         # Components chung (DataTable, Modal)
│   └── layout/         # Layout components (MainLayout)
├── pages/              # Các trang của ứng dụng
│   ├── auth/          # Đăng nhập, đăng ký
│   ├── drugs/         # Quản lý thuốc, loại thuốc, đơn vị
│   ├── inventory/     # Kho, cảnh báo tồn, lịch sử
│   └── suppliers/     # Nhà cung cấp, phiếu nhập
├── services/           # API services
│   ├── authService.js
│   ├── drugService.js
│   ├── inventoryService.js
│   └── supplierService.js
├── routes/             # Cấu hình routing
├── utils/              # Utilities, constants, http config
└── contexts/           # React Context (Auth)
```

## Cài đặt

1. Clone repository và cài đặt dependencies:

```bash
npm install
```

2. Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

3. Cấu hình API Gateway URL trong `.env`:

```
VITE_API_URL=http://localhost:8080
```

## Chạy ứng dụng

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Các chức năng chính

### 1. Xác thực (Authentication)
- Đăng nhập
- Đăng ký tài khoản
- Quản lý phiên đăng nhập với JWT token

### 2. Quản lý thuốc (Drug Management)
- CRUD thuốc
- Quản lý loại thuốc
- Quản lý đơn vị tính
- Tìm kiếm thuốc
- Xem thuốc sắp hết hàng
- Xem thuốc sắp hết hạn

### 3. Quản lý kho (Inventory Management)
- CRUD kho
- Xem lịch sử thay đổi tồn kho
- Cảnh báo tồn kho thấp
- Quản lý cảnh báo theo trạng thái

### 4. Quản lý nhà cung cấp (Supplier Management)
- CRUD nhà cung cấp
- Tạo phiếu nhập hàng
- Xem danh sách phiếu nhập
- Tự động cập nhật tồn kho khi nhập hàng

## API Services

Hệ thống kết nối với 4 microservices qua API Gateway (port 8080):

- **Auth Service** (port 8081) - Xác thực và phân quyền
- **Drug Service** (port 8082) - Quản lý thuốc
- **Inventory Service** (port 8083) - Quản lý kho và tồn
- **Supplier Service** (port 8084) - Quản lý nhà cung cấp

## Phân quyền

Hệ thống có 3 vai trò:

- **ADMIN** - Toàn quyền quản trị
- **MANAGER** - Quản lý dữ liệu
- **STAFF** - Nhân viên xem và thao tác cơ bản

## Môi trường phát triển

- Node.js >= 18
- npm hoặc yarn
- Backend services phải chạy trước

## Lưu ý

- Đảm bảo tất cả microservices đã chạy trước khi start frontend
- API Gateway phải chạy ở port 8080 (hoặc cấu hình trong .env)
- Token được lưu trong localStorage và cookie
- Session timeout: 7 ngày

## Hướng dẫn sử dụng

1. **Đăng nhập**: Truy cập `/login` để đăng nhập hệ thống
2. **Dashboard**: Sau khi đăng nhập, bạn sẽ thấy tổng quan hệ thống
3. **Quản lý dữ liệu**: Sử dụng sidebar để điều hướng đến các module khác nhau
4. **Thêm/Sửa/Xóa**: Mỗi trang có các nút tương ứng để quản lý dữ liệu

## License

MIT
