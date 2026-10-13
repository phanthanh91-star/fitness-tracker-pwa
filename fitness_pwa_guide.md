# 🏋️ Fitness Tracker PWA - Hướng dẫn cài đặt

FitTrack là ứng dụng web lũy tiến (Progressive Web App - PWA) chuyên nghiệp dùng để theo dõi lịch tập gym, ghi nhận khối lượng tạ (weight), số lần lặp (reps), bấm giờ nghỉ giữa hiệp (Rest Timer) và trực quan hóa biểu đồ tiến độ phát triển sức mạnh (PR).

---

## Bước 1: Cài Node.js

1. Truy cập trang chủ chính thức của Node.js: [nodejs.org](https://nodejs.org/).
2. Tải về phiên bản **LTS (Long Term Support)** khuyến nghị (Node.js phiên bản 18 trở lên).
3. Chạy file cài đặt vừa tải về và bấm **Next** cho đến khi hoàn tất.
4. Kiểm tra cài đặt bằng cách mở cửa sổ Terminal (hoặc PowerShell / Command Prompt) và gõ:
   ```bash
   node -v
   npm -v
   ```
   Nếu hiển thị số phiên bản (ví dụ: `v20.x.x` và `10.x.x`) là bạn đã cài đặt thành công.

---

## Bước 2: Chạy dự án

Mở PowerShell hoặc Command Prompt tại máy tính của bạn và thực hiện các lệnh sau:

1. **Di chuyển vào thư mục dự án:**
   ```bash
   cd C:\Users\thanh.pt\.gemini\antigravity\scratch\fitness_tracker_pwa
   ```

2. **Cài đặt các gói phụ thuộc (Dependencies):**
   ```bash
   npm install
   ```

3. **Khởi chạy môi trường phát triển (Dev Server):**
   ```bash
   npm run dev
   ```

4. Sau khi khởi chạy, terminal sẽ hiển thị địa chỉ cục bộ:
   - Cục bộ: `http://localhost:3000/`
   - Mạng LAN (để mở từ điện thoại): `http://<dia-chi-ip-may-tinh>:3000/`

5. Mở trình duyệt máy tính hoặc điện thoại truy cập vào địa chỉ trên để trải nghiệm ứng dụng ngay!

---

## Bước 3: Cài lên iPhone (Add to Home Screen)

Nhờ hỗ trợ chuẩn Progressive Web App (PWA), bạn có thể cài ứng dụng lên iPhone chạy mượt như một ứng dụng gốc (Native App) mà không cần qua App Store:

1. Đảm bảo iPhone và máy tính kết nối **chung một mạng Wi-Fi**.
2. Trên máy tính khi chạy `npm run dev -- --host`, bạn sẽ thấy địa chỉ IP mạng nội bộ (ví dụ: `http://192.168.1.15:3000`).
3. Mở trình duyệt **Safari** trên iPhone, nhập địa chỉ IP trên.
4. Bấm vào nút **Chia sẻ (Share)** ở thanh điều hướng dưới cùng của Safari (biểu tượng hình vuông có mũi tên chỉ lên ⬆️).
5. Cuộn xuống và chọn **"Thêm vào Màn hình chính" (Add to Home Screen)**.
6. Đặt tên hiển thị là **FitTrack** rồi nhấn **Thêm (Add)** ở góc trên bên phải.
7. Biểu tượng ứng dụng FitTrack với icon cử tạ 🏋️ sẽ xuất hiện trên màn hình iPhone của bạn. Khi mở ra, ứng dụng sẽ chạy toàn màn hình (không có thanh địa chỉ Safari), hỗ trợ giao diện tối (Dark mode) và bộ rung phản hồi khi hết giờ nghỉ.

---

## Bước 4: Cấu trúc code giải thích

Dự án được xây dựng theo kiến trúc module hóa gọn gàng, rõ ràng và chuẩn TypeScript:

```
fitness_tracker_pwa/
├── index.html                   # Trang HTML chính, chứa meta viewport chuẩn di động & Apple Web App
├── package.json                 # Khai báo React 18, Vite, TypeScript, Recharts
├── vite.config.ts               # Cấu hình Vite dev server (port 3000, host: true)
├── tsconfig.json                # Thiết lập strict type-checking TypeScript
├── public/
│   ├── manifest.json            # PWA Manifest định nghĩa màu sắc chủ đạo (#FF6B35), tên app và icon
│   └── sw.js                    # Service Worker lưu cache tài nguyên, hỗ trợ offline khi mất mạng
└── src/
    ├── main.tsx                 # Điểm khởi chạy React DOM và đăng ký Service Worker
    ├── App.tsx                  # Component vỏ bọc chính, điều phối navigation và state
    ├── App.module.css           # Bảng màu Dark Gym, CSS custom properties và layout chuẩn iPhone
    ├── types/
    │   └── index.ts             # Định nghĩa toàn bộ kiểu dữ liệu (Exercise, WorkoutSet, WorkoutSession...)
    ├── data/
    │   └── exercises.ts         # 20 bài tập mẫu chia theo 5 nhóm cơ chính (Ngực, Lưng, Chân, Vai, Tay)
    ├── hooks/
    │   ├── useLocalStorage.ts   # Tự động đồng bộ hóa state với localStorage của trình duyệt
    │   ├── useWorkout.ts        # Quản lý lịch sử buổi tập, tính tổng volume, chuỗi streak, giáo án
    │   └── useTimer.ts          # Logic đếm giờ tập luyện (stopwatch) và đếm ngược nghỉ (countdown)
    ├── pages/
    │   ├── Home/                # Lời chào theo giờ, streak, thống kê tuần, giáo án gợi ý
    │   ├── ActiveWorkout/       # Màn hình tập trực tiếp, chọn bài tập, nhập sets/reps, Rest Timer
    │   ├── History/             # Lịch sử chi tiết các buổi tập, xem lại sets và ghi chú
    │   ├── Progress/            # Biểu đồ Recharts theo dõi kỷ lục mức tạ (PR) theo thời gian
    │   └── Library/             # Danh mục 20 bài tập, hướng dẫn kỹ thuật chi tiết từng động tác
    └── components/
        ├── BottomNav/           # Thanh điều hướng 5 tab dưới đáy màn hình phong cách iOS
        ├── RestTimer/           # Widget đếm ngược thời gian nghỉ giữa các hiệp (kèm nút +/- 15s)
        ├── SetRow/              # Dòng nhập tạ, reps và nút tick hoàn thành hiệp tập
        └── ExerciseCard/        # Thẻ hiển thị bài tập kèm tag nhóm cơ
```

---

## Bước 5: Cách thêm/sửa bài tập

Bạn có thể dễ dàng bổ sung hoặc chỉnh sửa danh sách bài tập bằng cách mở file:
`src/data/exercises.ts`

Mỗi bài tập tuân theo cấu trúc TypeScript sau:

```typescript
{
  id: 'chest-incline-dumbbell-press',        // Mã định danh duy nhất (không trùng lặp)
  name: 'Incline Dumbbell Press',            // Tên bài tập
  category: 'Ngực',                          // Thuộc một trong 5 nhóm cơ: 'Ngực' | 'Lưng' | 'Chân' | 'Vai' | 'Tay'
  muscleGroups: ['Ngực trên', 'Vai trước'],  // Các nhóm cơ tác động phụ
  description: 'Mô tả ngắn gọn về tác dụng của bài tập...',
  instructions: [
    'Bước 1: Điều chỉnh ghế...',
    'Bước 2: Hít thở sâu và đẩy...',
    'Bước 3: Hạ tạ có kiểm soát...'
  ]
}
```

Chỉ cần thêm bài tập mới vào mảng `INITIAL_EXERCISES`, ứng dụng sẽ tự động cập nhật vào thư viện và bộ chọn bài tập.

---

## Bước 6: Cách backup dữ liệu

Toàn bộ dữ liệu buổi tập và giáo án được lưu trữ an toàn trong `localStorage` của trình duyệt dưới các khóa (keys):
- `fittrack_workouts`: Danh sách lịch sử các buổi tập, hiệp tập, khối lượng tạ và ghi chú.
- `fittrack_plans`: Danh sách giáo án và lịch phân chia buổi tập.

### Cách sao lưu (Backup) thủ công:
1. Mở ứng dụng trên trình duyệt Chrome/Safari/Edge.
2. Nhấn phím `F12` (hoặc chuột phải chọn **Kiểm tra / Inspect**) -> chuyển sang tab **Console**.
3. Dán dòng lệnh sau và nhấn **Enter**:
   ```javascript
   console.log(localStorage.getItem('fittrack_workouts'));
   ```
4. Copy toàn bộ chuỗi JSON xuất ra và lưu trữ vào một file text dự phòng.

### Cách khôi phục (Restore):
1. Trong tab **Console**, dán lệnh sau:
   ```javascript
   localStorage.setItem('fittrack_workouts', '<chuoi_json_da_sao_luu>');
   location.reload();
   ```
2. Trang web sẽ tải lại với toàn bộ lịch sử luyện tập được phục hồi nguyên vẹn.
