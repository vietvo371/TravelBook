import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

// GET /api/admin/statistics - Thống kê tổng quan TravelBook
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.vai_tro !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const thoiGianBatDau = searchParams.get("thoi_gian_bat_dau");
    const thoiGianKetThuc = searchParams.get("thoi_gian_ket_thuc");
    const windowDaysRaw = searchParams.get("window_days");
    const windowDays = Math.min(Math.max(parseInt(windowDaysRaw || "30"), 1), 180);

    // Xây dựng filter
    const whereClause: any = {};
    
    if (thoiGianBatDau && thoiGianKetThuc) {
      whereClause.created_at = {
        gte: new Date(thoiGianBatDau),
        lte: new Date(thoiGianKetThuc),
      };
    }

    // Thống kê tours theo trạng thái
    const tourStatusStats = await prisma.tour.groupBy({
      by: ["trang_thai"],
      _count: {
        id: true,
      },
    });

    // Thống kê bookings theo trạng thái
    const bookingStatusStats = await prisma.booking.groupBy({
      by: ["trang_thai"],
      where: whereClause,
      _count: {
        id: true,
      },
    });

    // Tổng số tours
    const totalTours = await prisma.tour.count();

    // Tổng số bookings
    const totalBookings = await prisma.booking.count({
      where: whereClause,
    });

    // Tổng doanh thu (từ bookings đã xác nhận)
    const confirmedBookings = await prisma.booking.findMany({
      where: {
        ...whereClause,
        trang_thai: "da_xac_nhan",
      },
      select: {
        tong_tien: true,
      },
    });
    const totalRevenue = confirmedBookings.reduce((sum: number, b: { tong_tien: number }) => sum + b.tong_tien, 0);

    // Tổng số người dùng
    const totalUsers = await prisma.nguoiDung.count();

    // Tổng số admin
    const totalAdmins = await prisma.nguoiDung.count({
      where: {
        vai_tro: "admin",
      },
    });

    // Time series theo ngày (đếm số bookings tạo mới)
    const toDate = thoiGianKetThuc ? new Date(thoiGianKetThuc) : new Date();
    const fromDate = thoiGianBatDau ? new Date(thoiGianBatDau) : new Date(toDate.getTime() - windowDays * 24 * 60 * 60 * 1000);
    const recentBookings = await prisma.booking.findMany({
      where: {
        ...whereClause,
        created_at: {
          gte: fromDate,
          lte: toDate,
        },
      },
      select: { created_at: true },
      orderBy: { created_at: "asc" },
      take: 5000,
    });
    const seriesMap = new Map<string, number>();
    // Khởi tạo đủ ngày trong khoảng
    for (let d = new Date(fromDate); d <= toDate; d = new Date(d.getTime() + 24 * 60 * 60 * 1000)) {
      const key = d.toISOString().slice(0, 10);
      seriesMap.set(key, 0);
    }
    for (const b of recentBookings) {
      const key = new Date(b.created_at).toISOString().slice(0, 10);
      seriesMap.set(key, (seriesMap.get(key) || 0) + 1);
    }
    const timeSeries = Array.from(seriesMap.entries()).map(([date, count]) => ({ date, count }));

    // Top tours được đặt nhiều nhất
    const topTours = await prisma.booking.groupBy({
      by: ["tour_id"],
      _count: {
        id: true,
      },
      _sum: {
        tong_tien: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 10,
    });

    // Lấy thông tin tour cho top tours
    const topToursWithInfo = await Promise.all(
      topTours.map(async (item: { tour_id: number; _count: { id: number }; _sum: { tong_tien: number | null } }) => {
        const tour = await prisma.tour.findUnique({
          where: { id: item.tour_id },
          select: { id: true, ten_tour: true, diem_den: true },
        });
        return {
          tour_id: item.tour_id,
          ten_tour: tour?.ten_tour || "Tour đã xóa",
          diem_den: tour?.diem_den || "N/A",
          so_luot_dat: item._count.id,
          tong_doanh_thu: item._sum.tong_tien || 0,
        };
      })
    );

    return NextResponse.json({
      statistics: {
        totalTours,
        totalBookings,
        totalUsers,
        totalAdmins,
        totalRevenue,
        tourStatusStats,
        bookingStatusStats,
        timeSeries,
        topTours: topToursWithInfo,
      },
    });
  } catch (error) {
    console.error("Get statistics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
