import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

// GET /api/admin/users - Lấy danh sách users (admin only)
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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const vai_tro = searchParams.get("vai_tro") || "";

    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { ho_ten: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { so_dien_thoai: { contains: search, mode: "insensitive" } },
      ];
    }
    if (vai_tro) {
      where.vai_tro = vai_tro;
    }

    const [users, total] = await Promise.all([
      prisma.nguoiDung.findMany({
        where,
        select: {
          id: true,
          ho_ten: true,
          email: true,
          so_dien_thoai: true,
          vai_tro: true,
          dia_chi: true,
          avatar_url: true,
          created_at: true,
          _count: {
            select: {
              bookings: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      prisma.nguoiDung.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách users" },
      { status: 500 }
    );
  }
}
