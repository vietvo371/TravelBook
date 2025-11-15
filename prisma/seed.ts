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
