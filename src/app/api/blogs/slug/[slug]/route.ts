import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

// GET /api/blogs/slug/[slug] - Lấy chi tiết blog theo slug (public)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const blog = await prisma.blog.findUnique({
      where: { slug },
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

    if (!blog) {
      return NextResponse.json(
        { error: "Không tìm thấy blog" },
        { status: 404 }
      );
    }

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

    if (!isAdmin && blog.trang_thai !== "published") {
      return NextResponse.json(
        { error: "Blog không khả dụng" },
        { status: 404 }
      );
    }

    // Tăng lượt xem
    await prisma.blog.update({
      where: { slug },
      data: {
        luot_xem: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ blog });
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy thông tin blog" },
      { status: 500 }
    );
  }
}

