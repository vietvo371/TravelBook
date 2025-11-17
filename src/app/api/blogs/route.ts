import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { Prisma } from "@prisma/client";

// GET /api/blogs - Lấy danh sách blogs (public)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const danh_muc = searchParams.get("danh_muc") || "";
    const trang_thai = searchParams.get("trang_thai") || "published"; // Default chỉ lấy published

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    // Public chỉ xem published, admin có thể xem tất cả
    const token = req.cookies.get("token")?.value;
    let isAdmin = false;
    if (token) {
      try {
        const payload = await verifyToken(token);
        isAdmin = payload?.vai_tro === "admin";
      } catch {
        // Token không hợp lệ, nhưng vẫn cho phép xem public blogs
        // Không cần làm gì, isAdmin vẫn là false
      }
    }

    if (!isAdmin) {
      where.trang_thai = "published";
    } else if (trang_thai && trang_thai !== "all") {
      where.trang_thai = trang_thai;
    }

    if (search) {
      where.OR = [
        { tieu_de: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { mo_ta_ngan: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { noi_dung: { contains: search, mode: Prisma.QueryMode.insensitive } },
      ];
    }

    if (danh_muc) {
      where.danh_muc = { contains: danh_muc, mode: Prisma.QueryMode.insensitive };
    }

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: {
          tac_gia: {
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
      prisma.blog.count({ where }),
    ]);

    return NextResponse.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách blog" },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Tạo blog mới (admin only)
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.vai_tro !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      tieu_de,
      slug,
      mo_ta_ngan,
      noi_dung,
      hinh_anh,
      danh_muc,
      tags,
      trang_thai,
      ngay_dang,
    } = body;

    // Validate required fields
    if (!tieu_de || !slug || !noi_dung) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin bắt buộc" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingBlog = await prisma.blog.findUnique({
      where: { slug },
    });

    if (existingBlog) {
      return NextResponse.json(
        { error: "Slug đã tồn tại, vui lòng chọn slug khác" },
        { status: 400 }
      );
    }

    const blog = await prisma.blog.create({
      data: {
        tieu_de,
        slug,
        mo_ta_ngan,
        noi_dung,
        hinh_anh,
        tac_gia_id: payload.userId,
        danh_muc,
        tags: tags || [],
        trang_thai: trang_thai || "draft",
        ngay_dang: ngay_dang ? new Date(ngay_dang) : trang_thai === "published" ? new Date() : null,
      },
      include: {
        tac_gia: {
          select: {
            id: true,
            ho_ten: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ blog }, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Lỗi khi tạo blog" },
      { status: 500 }
    );
  }
}

