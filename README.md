# Bản vá V1.6.1 — Startup & Sync Stability Fix

Xem [UPGRADE-V1.6.1.md](UPGRADE-V1.6.1.md) để cập nhật từ V1.6. Không cần SQL mới nếu đã cấu hình Storage V1.6.

# AI Skill Studio Core V1.2
Website tĩnh, không cần API AI. Giao diện tiếng Việt.

## Cài đặt
Giải nén ZIP, đưa toàn bộ nội dung (bao gồm vendor/) lên thư mục gốc repository GitHub. Settings → Pages → Deploy from a branch → main → /(root). Mở URL Pages bằng Chrome/Edge. Không cần cài npm. Có thể mở index.html trực tiếp để dùng thử local nếu trình duyệt cho phép IndexedDB; PWA yêu cầu HTTPS hoặc localhost.

## Local
Tạo Skill, chọn thư mục/file trong cây, dùng nút tạo, tải lên, thay thế, đổi tên/di chuyển, sao chép, xóa. Ctrl+S lưu nội dung text. Tải ZIP giữ thư mục gốc đúng tên kỹ thuật, kể cả thư mục trống. Nhập ZIP có đúng một SKILL.md. Sao lưu JSON toàn Studio thường xuyên; xóa dữ liệu trình duyệt có thể làm mất bản local. ZIP dùng JSZip đã đi kèm, không cần Internet. Không chạy mã trong Skill.

## Supabase (tùy chọn)
1. Tạo hoặc dùng project Supabase hiện có. Chạy supabase.sql một lần trong SQL Editor (policy đã có thì không tạo lại).
2. Trong Authentication → URL Configuration đặt Site URL là URL GitHub Pages của Studio; thêm redirect URL tương ứng nếu cần xác nhận email.
3. Vào Cấu hình trong Studio, nhập Project URL và publishable/anon key (không dùng service_role), email, mật khẩu, chọn Đăng ký hoặc Đăng nhập. Xác nhận email nếu project yêu cầu.
4. Chọn Đẩy dữ liệu lên Cloud hoặc Tải dữ liệu Cloud. Đây là đồng bộ thủ công toàn bộ bản chụp JSON, có kiểm tra revision và xác nhận ghi đè; không tự gộp xung đột từng file. Local không tự tách theo tài khoản: sao lưu và dùng hồ sơ trình duyệt riêng nếu nhiều người dùng chung máy. Không đăng nhập tài khoản khác rồi đẩy dữ liệu cũ nếu không muốn chia sẻ.
5. Chia sẻ: Công khai ZIP tạo bản phát hành trong bucket skill-public. Bất kỳ ai có URL đều có thể tải. Cập nhật ZIP bằng cách công khai lại; thu hồi ZIP bằng nút tương ứng. Master Link là JSON danh mục, cần xuất lại sau khi thay đổi danh mục. Xóa Skill local không tự thu hồi ZIP công khai; thu hồi trước khi xóa. Link công khai không bảo đảm AI tự tải/đọc ZIP.

## Phạm vi V1.0
Có dashboard, thư viện, tìm kiếm, quản lý file, editor text, PDF/ảnh preview, builder, knowledge, workflow tuần tự, danh sách dependency, validator cơ bản, kiểm thử thủ công, snapshot phiên bản, so sánh danh sách file, mẫu, thành phần dùng chung dạng sao chép, ZIP, chia sẻ, backup, cấu hình và service worker. Editor là textarea, chưa dùng Monaco; Markdown preview dạng text, chưa render rich Markdown; Word/Excel/PPT lưu gốc và tải xuống, chưa preview. Workflow chưa kéo thả sơ đồ; dependency dạng danh sách; component không tự liên kết phiên bản; cloud lưu JSON chứa file base64 thay vì storage riêng cho file private. Supabase SDK tải CDN khi online. Không có AI tích hợp. Dung lượng lớn có thể vượt quota trình duyệt/Supabase; khuyến nghị Skill nhỏ và sao lưu định kỳ.

## Kiểm tra
Đã chạy kiểm tra cú pháp JavaScript. Môi trường kiểm thử trình duyệt chặn điều hướng local/file nên chưa xác minh E2E hoặc PWA; Supabase cần project thật để kiểm thử. Hãy thử tạo Skill, thêm file MD và PDF, xuất ZIP, kiểm tra cây thư mục, nhập lại sau khi đổi tên Skill cũ, reload, sao lưu/phục hồi trước khi dùng dữ liệu quan trọng.

## V1.1 — Hướng dẫn & Skill Creator
- Nâng cấp: sao lưu V1.0 trước; thay các file trên cùng repository/đường dẫn GitHub Pages, giữ nguyên tên database IndexedDB. Creator mặc định được thêm một lần khi khởi động lần đầu bản V1.1, không ghi đè Skill trùng tên.
- Tab Hướng dẫn: đọc PDF mặc định, nhập PDF tối đa 25 MB/file, thay thế (giữ lịch sử), đổi tên, đặt chính, tải xuống, xóa, khôi phục mặc định. Tra cứu nhanh có thể sửa độc lập. Mục ⓘ xuất hiện khi chọn các thư mục chuẩn hoặc file chính.
- Tab Creator: mở Skill trong thư viện, tải ZIP hiện tại hoặc mặc định, nhập ZIP phiên bản mới (tên universal-ai-skill-creator), khôi phục mặc định có lưu bản cũ, tải Markdown portable, sao chép kích hoạt và tạo yêu cầu theo cấp độ.
- PDF tùy chỉnh, lịch sử và tra cứu nằm trong cùng state IndexedDB/JSON backup/Supabase với các Skill. Đồng bộ Cloud vẫn thủ công toàn bộ state, không đồng bộ từng file; PDF lớn và nhiều phiên bản có thể vượt hạn mức Cloud. Không cần SQL mới nếu đã dùng V1.0.
- Bản portable là bản mặc định, không tự cập nhật theo Creator đã sửa. AI bên ngoài cần công cụ đọc/tạo file để tạo ZIP thực tế. Các giới hạn V1.0 không được thay đổi trong bản này.

## V1.2 — My-Web-Ecosystem
- Giữ bảng `public.studio_state` và bucket `skill-public` của Studio, APP_ID `ai_skill_studio_core` dùng cho khóa phiên/cache. URL và publishable key đã cấu hình sẵn. Các phần hướng dẫn Supabase V1.0 ở trên đã được thay thế bởi mục này.
- Nếu bảng và bucket cùng policy của V1.1 đã tồn tại đúng trong My-Web-Ecosystem, **không cần chạy SQL**. Nếu chưa, kiểm tra schema/policy hiện có rồi chạy `supabase.sql` một lần. Script không xóa bảng hay dữ liệu, chỉ thêm policy còn thiếu; không xác minh hoặc sửa policy cùng tên đã tồn tại. Bucket công khai chỉ dành cho ZIP/Master Link chủ động chia sẻ, không dùng cho dữ liệu riêng.
- GitHub: tải ZIP giải nén lên cùng repository, giữ nguyên đường dẫn. Nếu đã có V1.1, chỉ cần cập nhật `index.html`, `app.js`, `cloud.js`, `sw.js`; README và SQL là tài liệu. Thêm URL Pages chính xác (đường dẫn thư mục có dấu / cuối) vào Authentication → URL Configuration → Redirect URLs; không đổi Site URL chung nếu các web khác đang dùng. Tải lại trang sau khi deploy để service worker cập nhật.
- Vào Tài khoản & Sao lưu, đăng nhập hoặc đăng ký. Dữ liệu local chưa có chủ sở hữu vẫn nằm ở khóa `studio` và không tự chuyển. Tài khoản có cache riêng. Đăng nhập sẽ tải Cloud nếu không có bản đang chờ ghi. Tài khoản mới có Cloud trống: dùng Chuyển dữ liệu cũ (tự xuất JSON và xác nhận), hoặc tạo Skill/Creator. Nếu tài khoản đã có dữ liệu, chức năng chuyển từ chối ghi đè; sao lưu cả hai rồi hợp nhất thủ công nếu cần. Bản cũ không bị xóa.
- Tự ghi snapshot sau khi lưu (debounce 900 ms), thử lại khi online và mỗi 30 giây khi trang mở. Bản Cloud mới được phát hiện định kỳ; dùng Đồng bộ ngay để tải khi không có thay đổi local. Khi xung đột, lưu file đang chỉnh, xuất bản sao, chọn Giữ bản Local hoặc Giữ bản Cloud. Không tự gộp từng file. Ghi có điều kiện theo revision; xóa file/Skill được phản ánh trong snapshot. Không tự phục hồi dữ liệu đã xóa từ snapshot cũ.
- Phiên dùng sessionStorage riêng APP_ID, đăng xuất scope local. Tab mới thường phải đăng nhập; Duplicate Tab có thể sao chép phiên. Web Locks (nếu trình duyệt hỗ trợ) ngăn hai tab cùng tài khoản mở cache đồng thời, nhưng không bảo đảm cách ly token khi nhân bản tab hoặc khi Web Locks không có. Không dùng thiết bị chung cho dữ liệu nhạy cảm; IndexedDB không mã hóa. Không lưu mật khẩu trong backup.
- Giới hạn: snapshot JSON (gồm base64 PDF và lịch sử) giới hạn gửi 20 MiB ở frontend; giới hạn thực tế có thể thấp hơn do Supabase/gateway. PDF 25 MB có thể lưu cục bộ nhưng không đồng bộ được. Chưa chuyển file private sang Storage. Không chạy nền khi đóng trang. Các bản Cloud lớn cần kiến trúc Storage riêng. Đổi mật khẩu dùng current_password và luồng nonce nếu SDK/server hỗ trợ. Chưa xác minh schema trực tiếp, RLS thực tế, email, browser E2E, offline/PWA và hai thiết bị. Chỉ kiểm tra cú pháp JS và đóng gói. Sao lưu trước khi triển khai.

## V1.3 — Bắt buộc đăng nhập
Cập nhật index.html, style.css, app.js, cloud.js, sw.js. Không cần SQL mới. Giao diện chính và đọc thư viện IndexedDB chỉ khởi tạo sau khi Supabase getUser xác nhận phiên. Khởi động cần Internet; phiên đang mở vẫn giữ cơ chế lưu offline của V1.2. Đăng ký và khôi phục mật khẩu vẫn có trên màn hình khóa. GitHub Pages vẫn công khai mã nguồn và tài nguyên tĩnh, các link Skill đã công khai vẫn truy cập được. RLS là lớp bảo vệ dữ liệu máy chủ. Chưa kiểm thử đăng nhập thực tế.

## V1.6 — Storage & Incremental Sync

Xem [UPGRADE-V1.6.md](UPGRADE-V1.6.md) trước khi triển khai. SQL nâng cấp: `upgrade-v1.6.sql`.
