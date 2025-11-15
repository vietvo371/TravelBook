import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/tours - Lấy danh sách tours (public)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const diem_den = searchParams.get("diem_den") || "";
    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");
    const soNgay = searchParams.get("so_ngay");
    const sortBy = searchParams.get("sort_by") || "newest";
    const trang_thai = searchParams.get("trang_thai") || "dang_ban";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (trang_thai) {
      where.trang_thai = trang_thai;
    }
    
    if (search) {
      where.OR = [
        { ten_tour: { contains: search, mode: "insensitive" } },
        { mo_ta_ngan: { contains: search, mode: "insensitive" } },
        { diem_den: { contains: search, mode: "insensitive" } },
      ];
    }
    
    if (diem_den) {
      where.diem_den = { contains: diem_den, mode: "insensitive" };
    }

    // Price filter
    if (minPrice || maxPrice) {
      where.gia_nguoi_lon = {};
      if (minPrice) {
        where.gia_nguoi_lon.gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        where.gia_nguoi_lon.lte = parseFloat(maxPrice);
      }
    }

    // Number of days filter
    if (soNgay) {
      const daysNum = parseInt(soNgay);
      if (daysNum === 6) {
        where.so_ngay = { gte: 6 };
      } else {
        where.so_ngay = daysNum;
      }
    }

    // Build orderBy
    let orderBy: any = { created_at: "desc" };
    switch (sortBy) {
      case "oldest":
        orderBy = { created_at: "asc" };
        break;
      case "price_asc":
        orderBy = { gia_nguoi_lon: "asc" };
        break;
      case "price_desc":
        orderBy = { gia_nguoi_lon: "desc" };
        break;
      case "days_asc":
        orderBy = { so_ngay: "asc" };
        break;
      case "days_desc":
        orderBy = { so_ngay: "desc" };
        break;
      default:
        orderBy = { created_at: "desc" };
    }

    const [tours, total] = await Promise.all([
      prisma.tour.findMany({
        where,
        include: {
          images: {
            orderBy: { thu_tu: "asc" },
            take: 1, // Chỉ lấy 1 hình đầu tiên
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.tour.count({ where }),
    ]);

    return NextResponse.json({
      tours,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching tours:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách tour" },
      { status: 500 }
    );
  }
}

// POST /api/tours - Tạo tour mới (admin only)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      ten_tour,
      mo_ta,
      mo_ta_ngan,
      gia_nguoi_lon,
      gia_tre_em,
      so_ngay,
      so_dem,
      diem_khoi_hanh,
      diem_den,
      phuong_tien,
      khach_san,
      lich_trinh,
      bao_gom,
      khong_bao_gom,
      dieu_kien,
      so_cho_toi_da,
      hinh_anh_chinh,
      images,
    } = body;

    // Validate required fields
    if (!ten_tour || !gia_nguoi_lon || !so_ngay || !so_dem || !diem_khoi_hanh || !diem_den || !phuong_tien || !so_cho_toi_da) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin bắt buộc" },
        { status: 400 }
      );
    }

    const tour = await prisma.tour.create({
      data: {
        ten_tour,
        mo_ta,
        mo_ta_ngan,
        gia_nguoi_lon: parseFloat(gia_nguoi_lon),
        gia_tre_em: gia_tre_em ? parseFloat(gia_tre_em) : null,
        so_ngay: parseInt(so_ngay),
        so_dem: parseInt(so_dem),
        diem_khoi_hanh,
        diem_den,
        phuong_tien,
        khach_san,
        lich_trinh: lich_trinh || null,
        bao_gom: bao_gom || [],
        khong_bao_gom: khong_bao_gom || [],
        dieu_kien,
        so_cho_toi_da: parseInt(so_cho_toi_da),
        so_cho_trong: parseInt(so_cho_toi_da),
        hinh_anh_chinh,
        images: images
          ? {
              create: images.map((img: any, index: number) => ({
                url: img.url,
                alt_text: img.alt_text,
                thu_tu: index,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json({ tour }, { status: 201 });
  } catch (error) {
    console.error("Error creating tour:", error);
    return NextResponse.json(
      { error: "Lỗi khi tạo tour" },
      { status: 500 }
    );
  }
}

