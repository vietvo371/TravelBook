import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

// GET /api/blogs/[id] - Lấy chi tiết blog (public)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id: parseInt(params.id) },
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
      } catch (error) {
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
      where: { id: parseInt(params.id) },
      data: {
        luot_xem: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy thông tin blog" },
      { status: 500 }
    );
  }
}

// PUT /api/blogs/[id] - Cập nhật blog (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if blog exists
    const existingBlog = await prisma.blog.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!existingBlog) {
      return NextResponse.json(
        { error: "Không tìm thấy blog" },
        { status: 404 }
      );
    }

    // Check if slug already exists (except current blog)
    if (slug && slug !== existingBlog.slug) {
      const slugExists = await prisma.blog.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Slug đã tồn tại, vui lòng chọn slug khác" },
          { status: 400 }
        );
      }
    }

    // Update blog
    const blog = await prisma.blog.update({
      where: { id: parseInt(params.id) },
      data: {
        tieu_de: tieu_de !== undefined ? tieu_de : undefined,
        slug: slug !== undefined ? slug : undefined,
        mo_ta_ngan: mo_ta_ngan !== undefined ? mo_ta_ngan : undefined,
        noi_dung: noi_dung !== undefined ? noi_dung : undefined,
        hinh_anh: hinh_anh !== undefined ? hinh_anh : undefined,
        danh_muc: danh_muc !== undefined ? danh_muc : undefined,
        tags: tags !== undefined ? tags : undefined,
        trang_thai: trang_thai !== undefined ? trang_thai : undefined,
        ngay_dang:
          ngay_dang !== undefined
            ? ngay_dang
              ? new Date(ngay_dang)
              : null
            : trang_thai === "published" && existingBlog.trang_thai !== "published"
            ? new Date()
            : undefined,
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

    return NextResponse.json({ blog });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật blog" },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/[id] - Xóa blog (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.vai_tro !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const blog = await prisma.blog.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!blog) {
      return NextResponse.json(
        { error: "Không tìm thấy blog" },
        { status: 404 }
      );
    }

    await prisma.blog.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: "Xóa blog thành công" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Lỗi khi xóa blog" },
      { status: 500 }
    );
  }
}

