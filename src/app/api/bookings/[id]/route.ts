import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

// GET /api/bookings/[id] - Lấy chi tiết booking
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      include: {
        tour: {
          include: {
            images: {
              orderBy: { thu_tu: "asc" },
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
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Không tìm thấy đặt tour" },
        { status: 404 }
      );
    }

    // Check if user has permission (owner or admin)
    if (payload.vai_tro !== "admin" && booking.nguoi_dung_id !== payload.userId) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 403 }
      );
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy thông tin đặt tour" },
      { status: 500 }
    );
  }
}

// PUT /api/bookings/[id] - Cập nhật booking (admin only hoặc owner)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { trang_thai, ghi_chu } = body;

    const existingBooking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      include: { tour: true },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: "Không tìm thấy đặt tour" },
        { status: 404 }
      );
    }

    // Only admin can update status, owner can only update note
    if (payload.vai_tro !== "admin" && existingBooking.nguoi_dung_id !== payload.userId) {
      return NextResponse.json(
        { error: "Không có quyền cập nhật" },
        { status: 403 }
      );
    }

    // If user is not admin, only allow updating ghi_chu
    const updateData: any = {};
    if (payload.vai_tro === "admin") {
      if (trang_thai) updateData.trang_thai = trang_thai;
    }
    if (ghi_chu !== undefined) updateData.ghi_chu = ghi_chu;

    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: updateData,
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

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật đặt tour" },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings/[id] - Hủy booking (admin hoặc owner)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      include: { tour: true },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Không tìm thấy đặt tour" },
        { status: 404 }
      );
    }

    // Check permission
    if (payload.vai_tro !== "admin" && booking.nguoi_dung_id !== payload.userId) {
      return NextResponse.json(
        { error: "Không có quyền hủy đặt tour này" },
        { status: 403 }
      );
    }

    // Restore available slots if booking was confirmed
    if (booking.trang_thai === "da_xac_nhan") {
      const tong_nguoi = booking.so_nguoi_lon + booking.so_tre_em;
      await prisma.tour.update({
        where: { id: booking.tour_id },
        data: {
          so_cho_trong: {
            increment: tong_nguoi,
          },
        },
      });
    }

    // Delete booking
    await prisma.booking.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Hủy đặt tour thành công" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Lỗi khi hủy đặt tour" },
      { status: 500 }
    );
  }
}

