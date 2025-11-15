import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

// GET /api/bookings - Lấy danh sách bookings
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const trang_thai = searchParams.get("trang_thai") || "";
    const userId = searchParams.get("userId");

    const skip = (page - 1) * limit;

    let where: any = {};

    // Nếu có userId trong query params, filter theo userId
    if (userId) {
      where.nguoi_dung_id = parseInt(userId);
    } else if (token) {
      // Nếu có token, lấy bookings của user đó (nếu không phải admin)
      const payload = await verifyToken(token);
      if (payload && payload.vai_tro !== "admin") {
        where.nguoi_dung_id = payload.userId;
      }
    } else {
      // Nếu không có token và không có userId, chỉ admin mới xem được
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (trang_thai) {
      where.trang_thai = trang_thai;
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          tour: {
            select: {
              id: true,
              ten_tour: true,
              hinh_anh_chinh: true,
              diem_den: true,
              images: {
                take: 1,
                select: {
                  url: true,
                },
              },
            },
          },
          nguoi_dung: {
            select: {
              id: true,
              ho_ten: true,
              email: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách đặt tour" },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Tạo booking mới (public, nhưng nếu có token thì link với user)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tour_id,
      ho_ten,
      email,
      so_dien_thoai,
      dia_chi,
      so_nguoi_lon,
      so_tre_em,
      ngay_khoi_hanh,
      ghi_chu,
    } = body;

    // Validate required fields
    if (!tour_id || !ho_ten || !email || !so_dien_thoai || !so_nguoi_lon || !ngay_khoi_hanh) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin bắt buộc" },
        { status: 400 }
      );
    }

    // Check if tour exists and has available slots
    const tour = await prisma.tour.findUnique({
      where: { id: parseInt(tour_id) },
    });

    if (!tour) {
      return NextResponse.json(
        { error: "Không tìm thấy tour" },
        { status: 404 }
      );
    }

    if (tour.trang_thai !== "dang_ban") {
      return NextResponse.json(
        { error: "Tour này hiện không khả dụng" },
        { status: 400 }
      );
    }

    const tong_nguoi = parseInt(so_nguoi_lon) + parseInt(so_tre_em || "0");
    if (tong_nguoi > tour.so_cho_trong) {
      return NextResponse.json(
        { error: `Tour chỉ còn ${tour.so_cho_trong} chỗ trống` },
        { status: 400 }
      );
    }

    // Calculate total price
    const tong_tien =
      parseFloat(so_nguoi_lon) * tour.gia_nguoi_lon +
      parseFloat(so_tre_em || "0") * (tour.gia_tre_em || tour.gia_nguoi_lon * 0.7);

    // Get user ID from token if available
    let nguoi_dung_id = null;
    const token = req.cookies.get("token")?.value;
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        nguoi_dung_id = payload.userId;
      }
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        tour_id: parseInt(tour_id),
        nguoi_dung_id,
        ho_ten,
        email,
        so_dien_thoai,
        dia_chi,
        so_nguoi_lon: parseInt(so_nguoi_lon),
        so_tre_em: parseInt(so_tre_em || "0"),
        ngay_khoi_hanh: new Date(ngay_khoi_hanh),
        ghi_chu,
        tong_tien,
      },
      include: {
        tour: {
          select: {
            id: true,
            ten_tour: true,
            diem_den: true,
          },
        },
      },
    });

    // Update available slots
    await prisma.tour.update({
      where: { id: parseInt(tour_id) },
      data: {
        so_cho_trong: tour.so_cho_trong - tong_nguoi,
      },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Lỗi khi đặt tour" },
      { status: 500 }
    );
  }
}

