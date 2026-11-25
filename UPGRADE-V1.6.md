# AI Skill Studio Core V1.6 — Storage & Incremental Sync

## Nâng cấp an toàn từ V1.5

1. Trên thiết bị đang có bản Local mới nhất (đặc biệt khi báo vượt 20 MiB), mở Tài khoản & Sao lưu → Xuất JSON. Giữ file này ở nơi an toàn. Không chọn Giữ bản Cloud, không xóa dữ liệu website.
2. Đóng các tab Studio khác. Truy cập Supabase project đang dùng cho Studio → SQL Editor → New query. Sao chép toàn bộ `upgrade-v1.6.sql`, nhấn Run. Script tạo bucket riêng tư `studio-private` và quyền đọc/thêm khối thuộc tài khoản đăng nhập. Không xóa bảng `studio_state`, bucket `skill-public` hay dữ liệu cũ. Với project mới, chạy `supabase.sql` thay thế (đã gồm migration).
3. Giải nén ZIP, tải nội dung thư mục gốc lên đúng repository GitHub Pages đang dùng. Giữ nguyên tên miền và đường dẫn để giữ IndexedDB. Chờ GitHub Pages triển khai, mở lại website và kiểm tra logo CORE · V1.6. Nếu vẫn V1.5, đóng các tab, mở lại, làm mới Ctrl+F5; có thể unregister service worker trong DevTools nếu cần, nhưng KHÔNG Clear site data.
4. Đăng nhập đúng tài khoản cũ. Mở Tài khoản & Sao lưu → Đồng bộ ngay. Theo dõi tiến độ Storage. Với dữ liệu cục bộ chưa đồng bộ và revision Cloud không đổi, Studio tự chuyển sang định dạng mới. Nếu chỉ có dữ liệu cũ trên Cloud, Studio tải bản cũ rồi chuyển đổi. Nếu xung đột, sao lưu cả hai trước khi chọn bản đúng. Không ghi đè Cloud khi chưa hiểu dữ liệu nào mới hơn.
5. Sau khi trạng thái Đã đồng bộ, thử mở trên thiết bị khác (cùng phiên bản V1.6, cùng tài khoản). Kiểm tra số Skill, nội dung file, PDF, lịch sử, thử sửa một file nhỏ và đồng bộ. Thiết bị đã có local có thể báo có bản Cloud mới; mở Tài khoản → Đồng bộ ngay để tải (không có thay đổi chưa lưu).

## Kiến trúc và phạm vi

- Không đổi IndexedDB, backup JSON, chức năng quản lý Skill, giao diện Impeccable hoặc cấu hình Supabase hiện tại. Backup JSON vẫn đầy đủ dữ liệu, không chỉ chứa con trỏ.
- `studio_state` giữ owner, revision và payload con trỏ manifest. Dữ liệu Skill/template/component/guide được lưu theo từng mục trong manifest; nội dung file và chuỗi lớn được tách riêng. Các đối tượng lưu dưới dạng JSON UTF-8, chia khối tối đa 1 MiB, định danh SHA-256. Không phải bảng SQL metadata có thể truy vấn từng Skill.
- Upload bất biến, tối đa 4 tác vụ song song; chỉ tải khối không có trong catalog của phiên bản hiện tại. Những lần upload gián đoạn được thử lại bằng cách kiểm tra khối đã tồn tại. Manifest chỉ được công bố bằng update có điều kiện revision sau khi tất cả khối mới đã tải xong. Không xóa bản Local nếu xảy ra lỗi. Nếu có xung đột, không tự hợp nhất hai bản; lựa chọn giữ bản vẫn áp dụng cho toàn thư viện.
- Download kiểm tra SHA-256 và kích thước, tận dụng khối đã có trong state cục bộ. Không đổi các giới hạn nhập ZIP/PDF riêng của ứng dụng.
- Không còn giới hạn Snapshot JSON 20 MiB của V1.5. Vẫn phụ thuộc dung lượng, băng thông, giới hạn request, chính sách và khả năng trình duyệt của Supabase/thiết bị. Lần chuyển đầu có thể tải nhiều khối. Các lần sau vẫn tính hash dữ liệu local và ghi manifest mới khi thay đổi.
- Khối cũ chưa được tự động dọn để tránh xóa nhầm dữ liệu khi có nhiều thiết bị, xung đột hoặc upload gián đoạn. Dung lượng Storage tính phí có thể tăng theo thời gian. Không xóa thủ công các khối nếu chưa có quy trình kiểm tra tham chiếu. Bucket private không thay thế bucket chia sẻ công khai cũ.
- Dùng tất cả thiết bị với V1.6 sau migration; phiên bản cũ không hiểu con trỏ manifest. Để quay lại V1.5 cần backup JSON đầy đủ và quy trình chuyển lại định dạng cũ; V1.5 vẫn có giới hạn 20 MiB.
- Kiểm thử: `node tests/storage-sync.test.cjs` (mock Storage, không cần tài khoản). Chưa kiểm thử RLS/SQL, upload thật, giao diện hoặc đồng bộ nhiều thiết bị trên project Supabase của người dùng.
