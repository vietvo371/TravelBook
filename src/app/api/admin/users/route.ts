import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

// GET /api/admin/users?role=khach_hang|admin
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.vai_tro !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") || undefined;

    const users = await prisma.nguoiDung.findMany({
      where: role ? { vai_tro: role } : undefined,
      select: { 
        id: true, 
        ho_ten: true, 
        email: true, 
        vai_tro: true,
        so_dien_thoai: true,
        dia_chi: true,
        created_at: true,
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
      take: 500,
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Get admin users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


