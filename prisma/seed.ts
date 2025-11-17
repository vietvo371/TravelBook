import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting TravelBook database seeding...');

  // Clear existing data (optional - be careful in production)
  // await prisma.booking.deleteMany();
  // await prisma.tourImage.deleteMany();
  // await prisma.tour.deleteMany();
  // await prisma.thongBao.deleteMany();
  // await prisma.token.deleteMany();
  // await prisma.nguoiDung.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.nguoiDung.upsert({
    where: { email: "admin@travelbook.com" },
    update: {},
    create: {
      email: "admin@travelbook.com",
      mat_khau: hashedPassword,
      ho_ten: "Admin TravelBook",
      so_dien_thoai: "0123456789",
      vai_tro: "admin",
      dia_chi: "Hà Nội, Việt Nam",
    },
  });

  console.log(`👤 Created admin user: ${admin.email}`);

  // Create sample customer users
  const customers = [];
  const customerData = [
    {
      email: "khach1@example.com",
      ho_ten: "Nguyễn Văn A",
      so_dien_thoai: "0912345678",
    },
    {
      email: "khach2@example.com",
      ho_ten: "Trần Thị B",
      so_dien_thoai: "0923456789",
    },
    {
      email: "khach3@example.com",
      ho_ten: "Lê Văn C",
      so_dien_thoai: "0934567890",
    },
  ];

  for (const data of customerData) {
    const customer = await prisma.nguoiDung.upsert({
      where: { email: data.email },
      update: {},
      create: {
        ...data,
        mat_khau: await bcrypt.hash("123456", 10),
        vai_tro: "khach_hang",
        dia_chi: "TP. Hồ Chí Minh, Việt Nam",
      },
    });
    customers.push(customer);
  }

  console.log(`👥 Created ${customers.length} customer users`);

  // Create sample tours
  const tours = [];
  const tourData = [
    {
      ten_tour: "Tour Đà Lạt 3N2Đ - Khám phá Thành phố Ngàn Hoa",
      mo_ta_ngan: "Khám phá thành phố mộng mơ với không khí trong lành, cảnh đẹp thiên nhiên và văn hóa đặc sắc",
      mo_ta: "Đà Lạt - thành phố ngàn hoa, nơi có khí hậu mát mẻ quanh năm. Tour sẽ đưa bạn đến các điểm tham quan nổi tiếng như Hồ Xuân Hương, Thung lũng Tình Yêu, Chùa Linh Phước, và nhiều địa điểm khác.",
      gia_nguoi_lon: 2500000,
      gia_tre_em: 1500000,
      so_ngay: 3,
      so_dem: 2,
      diem_khoi_hanh: "TP. Hồ Chí Minh",
      diem_den: "Đà Lạt",
      phuong_tien: "Xe du lịch",
      khach_san: "Khách sạn 3 sao",
      so_cho_toi_da: 30,
      so_cho_trong: 30,
      trang_thai: "dang_ban",
      bao_gom: [
        "Xe du lịch đời mới, máy lạnh",
        "Khách sạn 3 sao, phòng đôi/twin",
        "Ăn sáng tại khách sạn",
        "Hướng dẫn viên chuyên nghiệp",
        "Bảo hiểm du lịch",
      ],
      khong_bao_gom: [
        "Vé máy bay",
        "Ăn trưa, tối",
        "Chi phí cá nhân",
        "Thuế VAT",
      ],
      dieu_kien: "Hủy trước 7 ngày: hoàn 100%\nHủy trước 3 ngày: hoàn 50%\nHủy dưới 3 ngày: không hoàn",
      hinh_anh_chinh: "/images/cards/card-01.jpg",
      images: [
        { url: "/images/cards/card-01.jpg", alt_text: "Đà Lạt" },
        { url: "/images/cards/card-02.jpg", alt_text: "Hồ Xuân Hương" },
      ],
    },
    {
      ten_tour: "Tour Phú Quốc 4N3Đ - Thiên đường biển đảo",
      mo_ta_ngan: "Trải nghiệm thiên đường biển đảo với bãi biển đẹp, resort sang trọng và ẩm thực hải sản tươi ngon",
      mo_ta: "Phú Quốc - hòn đảo ngọc của Việt Nam với những bãi biển tuyệt đẹp, nước biển trong xanh. Tour bao gồm tham quan các bãi biển, làng chài, vườn tiêu và thưởng thức hải sản tươi sống.",
      gia_nguoi_lon: 3500000,
      gia_tre_em: 2000000,
      so_ngay: 4,
      so_dem: 3,
      diem_khoi_hanh: "TP. Hồ Chí Minh",
      diem_den: "Phú Quốc",
      phuong_tien: "Máy bay + Xe du lịch",
      khach_san: "Resort 4 sao",
      so_cho_toi_da: 25,
      so_cho_trong: 25,
      trang_thai: "dang_ban",
      bao_gom: [
        "Vé máy bay khứ hồi",
        "Resort 4 sao, phòng view biển",
        "Ăn sáng buffet",
        "Xe đưa đón sân bay",
        "Hướng dẫn viên",
        "Bảo hiểm du lịch",
      ],
      khong_bao_gom: [
        "Ăn trưa, tối",
        "Chi phí cá nhân",
        "Thuế VAT",
        "Dịch vụ spa",
      ],
      dieu_kien: "Hủy trước 14 ngày: hoàn 100%\nHủy trước 7 ngày: hoàn 70%\nHủy dưới 7 ngày: không hoàn",
      hinh_anh_chinh: "/images/cards/card-02.jpg",
      images: [
        { url: "/images/cards/card-02.jpg", alt_text: "Phú Quốc" },
        { url: "/images/cards/card-03.jpg", alt_text: "Bãi biển Phú Quốc" },
      ],
    },
    {
      ten_tour: "Tour Hà Nội - Sapa 5N4Đ - Khám phá vùng núi Tây Bắc",
      mo_ta_ngan: "Khám phá thủ đô Hà Nội và vùng núi Sapa với cảnh quan hùng vĩ, văn hóa dân tộc đa dạng",
      mo_ta: "Hành trình đưa bạn từ thủ đô Hà Nội đến Sapa - thị trấn mù sương nổi tiếng. Tham quan các điểm như Fansipan, bản Cát Cát, thung lũng Mường Hoa và trải nghiệm văn hóa các dân tộc vùng cao.",
      gia_nguoi_lon: 4200000,
      gia_tre_em: 2500000,
      so_ngay: 5,
      so_dem: 4,
      diem_khoi_hanh: "TP. Hồ Chí Minh",
      diem_den: "Hà Nội - Sapa",
      phuong_tien: "Máy bay + Xe du lịch",
      khach_san: "Khách sạn 3-4 sao",
      so_cho_toi_da: 20,
      so_cho_trong: 20,
      trang_thai: "dang_ban",
      bao_gom: [
        "Vé máy bay khứ hồi",
        "Khách sạn 3-4 sao",
        "Ăn sáng",
        "Xe du lịch đời mới",
        "Hướng dẫn viên",
        "Vé cáp treo Fansipan",
        "Bảo hiểm du lịch",
      ],
      khong_bao_gom: [
        "Ăn trưa, tối",
        "Chi phí cá nhân",
        "Thuế VAT",
      ],
      dieu_kien: "Hủy trước 10 ngày: hoàn 100%\nHủy trước 5 ngày: hoàn 50%\nHủy dưới 5 ngày: không hoàn",
      hinh_anh_chinh: "/images/cards/card-03.jpg",
      images: [
        { url: "/images/cards/card-03.jpg", alt_text: "Sapa" },
        { url: "/images/cards/card-01.jpg", alt_text: "Fansipan" },
      ],
    },
  ];

  for (const data of tourData) {
    const { images, ...tourInfo } = data;
    const tour = await prisma.tour.create({
      data: {
        ...tourInfo,
        images: {
          create: images.map((img, index) => ({
            url: img.url,
            alt_text: img.alt_text,
            thu_tu: index,
          })),
        },
      },
    });
    tours.push(tour);
  }

  console.log(`✈️ Created ${tours.length} tours`);

  // Create sample bookings
  const bookings = [];
  const bookingData = [
    {
      tour_id: tours[0].id,
      nguoi_dung_id: customers[0].id,
      ho_ten: "Nguyễn Văn A",
      email: "khach1@example.com",
      so_dien_thoai: "0912345678",
      dia_chi: "123 Đường ABC, Quận 1, TP.HCM",
      so_nguoi_lon: 2,
      so_tre_em: 1,
      ngay_khoi_hanh: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      tong_tien: 2 * tours[0].gia_nguoi_lon + 1 * (tours[0].gia_tre_em || 0),
      trang_thai: "cho_xac_nhan",
      ghi_chu: "Cần phòng view đẹp",
    },
    {
      tour_id: tours[1].id,
      nguoi_dung_id: null, // Guest booking
      ho_ten: "Trần Thị D",
      email: "guest@example.com",
      so_dien_thoai: "0945678901",
      dia_chi: "456 Đường XYZ, Quận 2, TP.HCM",
      so_nguoi_lon: 1,
      so_tre_em: 0,
      ngay_khoi_hanh: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
      tong_tien: tours[1].gia_nguoi_lon,
      trang_thai: "da_xac_nhan",
      ghi_chu: "",
    },
  ];

  for (const data of bookingData) {
    const booking = await prisma.booking.create({
      data,
    });
    bookings.push(booking);

    // Update available slots if booking is confirmed
    if (data.trang_thai === "da_xac_nhan") {
      const tour = await prisma.tour.findUnique({
        where: { id: data.tour_id },
      });
      if (tour) {
        await prisma.tour.update({
          where: { id: data.tour_id },
          data: {
            so_cho_trong: tour.so_cho_trong - (data.so_nguoi_lon + data.so_tre_em),
          },
        });
      }
    }
  }

  console.log(`📋 Created ${bookings.length} bookings`);

  // Create sample notifications
  const notifications = [];
  for (const booking of bookings) {
    if (booking.nguoi_dung_id) {
      const notification = await prisma.thongBao.create({
        data: {
          nguoi_dung_id: booking.nguoi_dung_id,
          booking_id: booking.id,
          tieu_de: "Đặt tour thành công",
          noi_dung: `Bạn đã đặt tour thành công. Mã đặt tour: #${booking.id}`,
          loai: "dat_tour",
          da_doc: false,
        },
      });
      notifications.push(notification);
    }
  }

  console.log(`🔔 Created ${notifications.length} notifications`);

  // Create sample blogs
  const blogs = [];
  const blogData = [
    {
      tieu_de: "10 Điểm Đến Du Lịch Đẹp Nhất Việt Nam 2025",
      slug: "10-diem-den-du-lich-dep-nhat-viet-nam-2025",
      mo_ta_ngan: "Khám phá những địa điểm du lịch tuyệt vời nhất tại Việt Nam, từ phố cổ Hội An đến vịnh Hạ Long hùng vĩ...",
      noi_dung: "Việt Nam là một đất nước với vô vàn cảnh đẹp thiên nhiên và văn hóa đặc sắc. Từ Bắc vào Nam, mỗi vùng miền đều có những điểm đến hấp dẫn riêng.\n\n1. Vịnh Hạ Long - Kỳ quan thiên nhiên thế giới với hàng nghìn đảo đá vôi kỳ vĩ\n2. Phố cổ Hội An - Di sản văn hóa thế giới với kiến trúc cổ kính\n3. Đà Lạt - Thành phố ngàn hoa với khí hậu mát mẻ quanh năm\n4. Phú Quốc - Thiên đường biển đảo với những bãi biển tuyệt đẹp\n5. Sapa - Vùng núi Tây Bắc với ruộng bậc thang hùng vĩ\n6. Huế - Cố đô với di tích lịch sử và văn hóa\n7. Mỹ Tho - Châu thổ sông Cửu Long với vườn trái cây\n8. Nha Trang - Thành phố biển với resort sang trọng\n9. Đà Nẵng - Thành phố đáng sống với nhiều điểm tham quan\n10. Cần Thơ - Trung tâm đồng bằng sông Cửu Long",
      hinh_anh: "/images/cards/card-01.jpg",
      danh_muc: "Du lịch trong nước",
      tags: ["Việt Nam", "Du lịch", "Điểm đến", "2025"],
      trang_thai: "published",
      ngay_dang: new Date("2025-11-15"),
    },
    {
      tieu_de: "Bí Quyết Đặt Tour Du Lịch Tiết Kiệm",
      slug: "bi-quyet-dat-tour-du-lich-tiet-kiem",
      mo_ta_ngan: "Những mẹo hay giúp bạn đặt tour du lịch với giá tốt nhất, tận dụng các chương trình khuyến mãi...",
      noi_dung: "Đặt tour du lịch với giá tốt không phải là điều khó khăn nếu bạn biết những bí quyết sau:\n\n1. Đặt tour sớm - Nhiều công ty du lịch có chương trình giảm giá cho khách đặt sớm\n2. Theo dõi các chương trình khuyến mãi - Đăng ký nhận thông báo từ các website du lịch\n3. Đặt tour vào mùa thấp điểm - Giá tour thường rẻ hơn vào mùa thấp điểm\n4. So sánh giá từ nhiều nguồn - Không nên chỉ xem một nguồn\n5. Tận dụng các chương trình tích điểm - Nhiều thẻ tín dụng có chương trình tích điểm\n6. Đặt tour theo nhóm - Giá tour theo nhóm thường rẻ hơn\n7. Lựa chọn tour phù hợp với ngân sách - Không cần phải chọn tour đắt nhất",
      hinh_anh: "/images/cards/card-02.jpg",
      danh_muc: "Tips du lịch",
      tags: ["Tiết kiệm", "Mẹo", "Tour", "Du lịch"],
      trang_thai: "published",
      ngay_dang: new Date("2025-11-12"),
    },
    {
      tieu_de: "Hành Trình Khám Phá Đà Lạt - Thành Phố Ngàn Hoa",
      slug: "hanh-trinh-kham-pha-da-lat-thanh-pho-ngan-hoa",
      mo_ta_ngan: "Trải nghiệm Đà Lạt với khí hậu mát mẻ, cảnh đẹp thiên nhiên và văn hóa đặc sắc của vùng cao nguyên...",
      noi_dung: "Đà Lạt - thành phố ngàn hoa, nơi có khí hậu mát mẻ quanh năm. Thành phố này nằm ở độ cao 1.500m so với mực nước biển, tạo nên một khí hậu ôn đới độc đáo.\n\nCác điểm tham quan nổi tiếng:\n- Hồ Xuân Hương: Hồ nước đẹp ở trung tâm thành phố\n- Thung lũng Tình Yêu: Địa điểm lãng mạn với hoa và cảnh đẹp\n- Chùa Linh Phước: Ngôi chùa với kiến trúc độc đáo\n- Đồi Cù: Đồi cỏ xanh với view toàn thành phố\n- Vườn hoa thành phố: Nơi trưng bày nhiều loài hoa đẹp\n\nẨm thực Đà Lạt:\n- Bánh mì xíu mại\n- Bánh căn\n- Bánh tráng nướng\n- Dâu tây tươi\n- Rượu vang Đà Lạt",
      hinh_anh: "/images/cards/card-03.jpg",
      danh_muc: "Du lịch trong nước",
      tags: ["Đà Lạt", "Du lịch", "Cao nguyên", "Việt Nam"],
      trang_thai: "published",
      ngay_dang: new Date("2025-11-10"),
    },
    {
      tieu_de: "Checklist Chuẩn Bị Cho Chuyến Du Lịch Dài Ngày",
      slug: "checklist-chuan-bi-cho-chuyen-du-lich-dai-ngay",
      mo_ta_ngan: "Danh sách đầy đủ những vật dụng cần thiết cho chuyến du lịch dài ngày, đảm bảo bạn không quên gì...",
      noi_dung: "Chuẩn bị kỹ lưỡng là chìa khóa cho một chuyến du lịch thành công. Dưới đây là checklist đầy đủ:\n\nGiấy tờ:\n- Hộ chiếu/Visa (nếu đi nước ngoài)\n- Vé máy bay/tàu/xe\n- Bảo hiểm du lịch\n- Bản sao giấy tờ quan trọng\n\nQuần áo:\n- Quần áo phù hợp với thời tiết\n- Áo khoác/áo mưa\n- Giày dép thoải mái\n- Đồ lót đủ dùng\n\nĐồ dùng cá nhân:\n- Bàn chải đánh răng, kem đánh răng\n- Dầu gội, sữa tắm\n- Khăn tắm\n- Thuốc men cá nhân\n\nĐồ điện tử:\n- Điện thoại và sạc\n- Máy ảnh\n- Power bank\n- Adapter (nếu đi nước ngoài)\n\nKhác:\n- Tiền mặt và thẻ tín dụng\n- Bản đồ/GPS\n- Sách/trò chơi giải trí",
      hinh_anh: "/images/cards/card-01.jpg",
      danh_muc: "Tips du lịch",
      tags: ["Checklist", "Chuẩn bị", "Du lịch", "Mẹo"],
      trang_thai: "published",
      ngay_dang: new Date("2025-11-08"),
    },
    {
      tieu_de: "Phú Quốc - Thiên Đường Biển Đảo Của Việt Nam",
      slug: "phu-quoc-thien-duong-bien-dao-cua-viet-nam",
      mo_ta_ngan: "Khám phá hòn đảo ngọc Phú Quốc với những bãi biển tuyệt đẹp, resort sang trọng và ẩm thực hải sản tươi ngon...",
      noi_dung: "Phú Quốc - hòn đảo ngọc của Việt Nam, nằm ở vịnh Thái Lan. Đảo này nổi tiếng với những bãi biển tuyệt đẹp, nước biển trong xanh và cát trắng mịn.\n\nCác bãi biển nổi tiếng:\n- Bãi Sao: Bãi biển đẹp nhất với cát trắng mịn\n- Bãi Dài: Bãi biển dài với nhiều resort\n- Bãi Khem: Bãi biển yên tĩnh, lý tưởng để nghỉ dưỡng\n- Bãi Trường: Bãi biển dài với nhiều hoạt động\n\nĐiểm tham quan:\n- Vườn Quốc gia Phú Quốc\n- Làng chài Hàm Ninh\n- Vườn tiêu\n- Nhà tù Phú Quốc\n- Chợ đêm Phú Quốc\n\nẨm thực:\n- Hải sản tươi sống\n- Nước mắm Phú Quốc\n- Sim rừng\n- Rượu sim",
      hinh_anh: "/images/cards/card-02.jpg",
      danh_muc: "Du lịch trong nước",
      tags: ["Phú Quốc", "Biển đảo", "Du lịch", "Việt Nam"],
      trang_thai: "published",
      ngay_dang: new Date("2025-11-05"),
    },
    {
      tieu_de: "Những Lưu Ý Khi Đặt Tour Du Lịch Quốc Tế",
      slug: "nhung-luu-y-khi-dat-tour-du-lich-quoc-te",
      mo_ta_ngan: "Các điều cần biết khi đặt tour du lịch nước ngoài: visa, bảo hiểm, tiền tệ và các thủ tục cần thiết...",
      noi_dung: "Du lịch quốc tế đòi hỏi sự chuẩn bị kỹ lưỡng hơn so với du lịch trong nước. Dưới đây là những lưu ý quan trọng:\n\nVisa:\n- Kiểm tra yêu cầu visa của quốc gia bạn muốn đến\n- Chuẩn bị hồ sơ xin visa sớm\n- Đảm bảo hộ chiếu còn hạn ít nhất 6 tháng\n\nBảo hiểm:\n- Mua bảo hiểm du lịch quốc tế\n- Kiểm tra phạm vi bảo hiểm\n- Lưu số điện thoại khẩn cấp\n\nTiền tệ:\n- Đổi tiền trước khi đi\n- Mang thẻ tín dụng quốc tế\n- Kiểm tra tỷ giá hối đoái\n\nSức khỏe:\n- Tiêm phòng nếu cần\n- Mang thuốc men cá nhân\n- Kiểm tra yêu cầu y tế của quốc gia\n\nKhác:\n- Nghiên cứu văn hóa địa phương\n- Học một vài câu giao tiếp cơ bản\n- Lưu thông tin đại sứ quán",
      hinh_anh: "/images/cards/card-03.jpg",
      danh_muc: "Du lịch quốc tế",
      tags: ["Du lịch quốc tế", "Visa", "Bảo hiểm", "Mẹo"],
      trang_thai: "published",
      ngay_dang: new Date("2025-11-03"),
    },
    {
      tieu_de: "Sapa - Nơi Gặp Gỡ Giữa Trời Và Đất",
      slug: "sapa-noi-gap-go-giua-troi-va-dat",
      mo_ta_ngan: "Khám phá Sapa với những ruộng bậc thang tuyệt đẹp, văn hóa dân tộc đa dạng và khí hậu mát mẻ quanh năm...",
      noi_dung: "Sapa - thị trấn mù sương nằm ở độ cao 1.600m, là điểm đến lý tưởng cho những ai yêu thích thiên nhiên và văn hóa.\n\nCảnh quan:\n- Ruộng bậc thang: Những thửa ruộng bậc thang tuyệt đẹp\n- Núi Fansipan: Nóc nhà Đông Dương\n- Thung lũng Mường Hoa: Thung lũng với nhiều bản làng\n- Cầu Mây: Cây cầu treo độc đáo\n\nVăn hóa:\n- Bản Cát Cát: Bản làng của người H'Mông\n- Bản Tả Phìn: Bản làng của người Dao\n- Chợ tình Sapa: Chợ đặc biệt vào cuối tuần\n- Văn hóa các dân tộc: H'Mông, Dao, Tày, Giáy\n\nHoạt động:\n- Trekking\n- Leo núi Fansipan\n- Tham quan bản làng\n- Mua sắm đồ thủ công",
      hinh_anh: "/images/cards/card-01.jpg",
      danh_muc: "Du lịch trong nước",
      tags: ["Sapa", "Du lịch", "Văn hóa", "Việt Nam"],
      trang_thai: "published",
      ngay_dang: new Date("2025-11-01"),
    },
    {
      tieu_de: "Cách Chọn Tour Du Lịch Phù Hợp Với Ngân Sách",
      slug: "cach-chon-tour-du-lich-phu-hop-voi-ngan-sach",
      mo_ta_ngan: "Hướng dẫn chi tiết cách lựa chọn tour du lịch phù hợp với ngân sách của bạn mà vẫn đảm bảo chất lượng...",
      noi_dung: "Chọn tour du lịch phù hợp với ngân sách không có nghĩa là phải hy sinh chất lượng. Dưới đây là cách chọn tour thông minh:\n\n1. Xác định ngân sách:\n- Quyết định số tiền bạn sẵn sàng chi cho chuyến đi\n- Bao gồm cả chi phí phát sinh\n\n2. So sánh các tour:\n- So sánh giá từ nhiều công ty\n- Kiểm tra những gì được bao gồm\n- Đọc kỹ điều khoản\n\n3. Lựa chọn thời điểm:\n- Mùa thấp điểm thường rẻ hơn\n- Tránh các ngày lễ tết\n\n4. Lựa chọn loại tour:\n- Tour trọn gói vs tour tự túc\n- Tour nhóm vs tour riêng\n\n5. Kiểm tra chất lượng:\n- Đọc review từ khách hàng\n- Kiểm tra uy tín công ty\n- Xem hình ảnh thực tế",
      hinh_anh: "/images/cards/card-02.jpg",
      danh_muc: "Tips du lịch",
      tags: ["Ngân sách", "Tour", "Mẹo", "Du lịch"],
      trang_thai: "published",
      ngay_dang: new Date("2025-10-28"),
    },
    {
      tieu_de: "Thái Lan - Điểm Đến Lý Tưởng Cho Du Lịch Quốc Tế",
      slug: "thai-lan-diem-den-ly-tuong-cho-du-lich-quoc-te",
      mo_ta_ngan: "Khám phá đất nước Thái Lan với văn hóa đặc sắc, ẩm thực phong phú và những điểm đến nổi tiếng...",
      noi_dung: "Thái Lan - xứ sở chùa vàng, là điểm đến lý tưởng cho du lịch quốc tế với nhiều điểm đến hấp dẫn.\n\nBangkok:\n- Chùa Wat Phra Kaew\n- Chùa Wat Pho\n- Chợ nổi Damnoen Saduak\n- Khao San Road\n\nChiang Mai:\n- Chùa Doi Suthep\n- Elephant Nature Park\n- Night Bazaar\n- Cooking class\n\nPhuket:\n- Bãi biển Patong\n- Vịnh Phang Nga\n- Đảo Phi Phi\n- Snorkeling\n\nẨm thực:\n- Pad Thai\n- Tom Yum Goong\n- Mango Sticky Rice\n- Street food\n\nVăn hóa:\n- Lễ hội Songkran\n- Muay Thai\n- Massage Thái\n- Chùa chiền",
      hinh_anh: "/images/cards/card-03.jpg",
      danh_muc: "Du lịch quốc tế",
      tags: ["Thái Lan", "Du lịch quốc tế", "Châu Á", "Du lịch"],
      trang_thai: "published",
      ngay_dang: new Date("2025-10-25"),
    },
    {
      tieu_de: "Hạ Long - Kỳ Quan Thiên Nhiên Thế Giới",
      slug: "ha-long-ky-quan-thien-nhien-the-gioi",
      mo_ta_ngan: "Trải nghiệm vịnh Hạ Long với hàng nghìn đảo đá vôi kỳ vĩ, hang động bí ẩn và cảnh quan thiên nhiên tuyệt đẹp...",
      noi_dung: "Vịnh Hạ Long - kỳ quan thiên nhiên thế giới, nằm ở vịnh Bắc Bộ. Vịnh có hơn 1.600 đảo đá vôi và đảo đá vôi, tạo nên một cảnh quan độc đáo.\n\nĐiểm tham quan:\n- Hang Sửng Sốt: Hang động lớn và đẹp nhất\n- Hang Đầu Gỗ: Hang động với nhiều nhũ đá\n- Đảo Ti Tốp: Đảo với bãi biển đẹp\n- Đảo Cát Bà: Đảo lớn nhất với nhiều hoạt động\n\nHoạt động:\n- Du thuyền trên vịnh\n- Kayaking\n- Tham quan hang động\n- Tắm biển\n- Leo núi\n\nThời gian tốt nhất:\n- Tháng 3-5: Thời tiết mát mẻ\n- Tháng 9-11: Thời tiết đẹp, ít mưa\n\nLưu ý:\n- Mang theo áo khoác\n- Mang theo kem chống nắng\n- Đặt tour sớm",
      hinh_anh: "/images/cards/card-01.jpg",
      danh_muc: "Du lịch trong nước",
      tags: ["Hạ Long", "Du lịch", "Việt Nam", "Kỳ quan"],
      trang_thai: "published",
      ngay_dang: new Date("2025-10-22"),
    },
    {
      tieu_de: "Nhật Bản - Xứ Sở Hoa Anh Đào",
      slug: "nhat-ban-xu-so-hoa-anh-dao",
      mo_ta_ngan: "Khám phá Nhật Bản với văn hóa truyền thống độc đáo, ẩm thực tinh tế và cảnh quan thiên nhiên tuyệt đẹp...",
      noi_dung: "Nhật Bản - xứ sở mặt trời mọc, là điểm đến lý tưởng với văn hóa độc đáo và cảnh quan tuyệt đẹp.\n\nTokyo:\n- Tháp Tokyo\n- Chùa Senso-ji\n- Shibuya Crossing\n- Harajuku\n\nKyoto:\n- Chùa Fushimi Inari\n- Kinkaku-ji (Chùa Vàng)\n- Arashiyama Bamboo Grove\n- Gion District\n\nOsaka:\n- Lâu đài Osaka\n- Dotonbori\n- Universal Studios Japan\n- Ẩm thực đường phố\n\nMùa hoa anh đào:\n- Tháng 3-4: Thời điểm hoa anh đào nở\n- Hanami: Lễ hội ngắm hoa anh đào\n\nẨm thực:\n- Sushi\n- Ramen\n- Tempura\n- Wagyu beef",
      hinh_anh: "/images/cards/card-02.jpg",
      danh_muc: "Du lịch quốc tế",
      tags: ["Nhật Bản", "Du lịch quốc tế", "Châu Á", "Hoa anh đào"],
      trang_thai: "published",
      ngay_dang: new Date("2025-10-20"),
    },
    {
      tieu_de: "Mẹo Đóng Gói Hành Lý Thông Minh Cho Chuyến Du Lịch",
      slug: "meo-dong-goi-hanh-ly-thong-minh-cho-chuyen-du-lich",
      mo_ta_ngan: "Những bí quyết đóng gói hành lý hiệu quả, tiết kiệm không gian và đảm bảo bạn có đủ mọi thứ cần thiết...",
      noi_dung: "Đóng gói hành lý thông minh giúp bạn tiết kiệm không gian và tránh quên đồ. Dưới đây là những mẹo hay:\n\n1. Lập danh sách:\n- Viết ra tất cả những gì cần mang\n- Kiểm tra lại trước khi đóng\n\n2. Cuộn quần áo:\n- Cuộn thay vì gấp tiết kiệm không gian\n- Đặt quần áo nặng ở dưới\n\n3. Sử dụng túi nén:\n- Túi nén giúp giảm thể tích\n- Đặc biệt hữu ích cho áo khoác\n\n4. Tận dụng không gian:\n- Đặt đồ trong giày\n- Sử dụng các ngăn nhỏ\n\n5. Mang đồ đa năng:\n- Quần áo có thể mix & match\n- Đồ có thể mặc nhiều cách\n\n6. Kiểm tra trọng lượng:\n- Đảm bảo không vượt quá giới hạn\n- Cân hành lý trước khi đi",
      hinh_anh: "/images/cards/card-03.jpg",
      danh_muc: "Tips du lịch",
      tags: ["Hành lý", "Mẹo", "Du lịch", "Chuẩn bị"],
      trang_thai: "published",
      ngay_dang: new Date("2025-10-18"),
    },
  ];

  for (const data of blogData) {
    const blog = await prisma.blog.create({
      data: {
        ...data,
        tac_gia_id: admin.id,
      },
    });
    blogs.push(blog);
  }

  console.log(`📝 Created ${blogs.length} blog posts`);

  console.log('✅ TravelBook database seeding completed!');
  console.log('\n📝 Login credentials:');
  console.log('   Admin: admin@travelbook.com / admin123');
  console.log('   Customer: khach1@example.com / 123456');
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
