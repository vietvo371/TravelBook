import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/tours/[id] - Lấy chi tiết tour (public)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tour = await prisma.tour.findUnique({
      where: { id: parseInt(id) },
      include: {
        images: {
          orderBy: { thu_tu: "asc" },
        },
      },
    });

    if (!tour) {
      return NextResponse.json(
        { error: "Không tìm thấy tour" },
        { status: 404 }
      );
    }

    return NextResponse.json({ tour });
  } catch (error) {
    console.error("Error fetching tour:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy thông tin tour" },
      { status: 500 }
    );
  }
}

// PUT /api/tours/[id] - Cập nhật tour (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      so_cho_trong,
      trang_thai,
      hinh_anh_chinh,
      images,
    } = body;

    // Check if tour exists
    const existingTour = await prisma.tour.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingTour) {
      return NextResponse.json(
        { error: "Không tìm thấy tour" },
        { status: 404 }
      );
    }

    // Update tour
    const tour = await prisma.tour.update({
      where: { id: parseInt(id) },
      data: {
        ten_tour,
        mo_ta,
        mo_ta_ngan,
        gia_nguoi_lon: gia_nguoi_lon ? parseFloat(gia_nguoi_lon) : undefined,
        gia_tre_em: gia_tre_em ? parseFloat(gia_tre_em) : undefined,
        so_ngay: so_ngay ? parseInt(so_ngay) : undefined,
        so_dem: so_dem ? parseInt(so_dem) : undefined,
        diem_khoi_hanh,
        diem_den,
        phuong_tien,
        khach_san,
        lich_trinh: lich_trinh !== undefined ? lich_trinh : undefined,
        bao_gom: bao_gom !== undefined ? bao_gom : undefined,
        khong_bao_gom: khong_bao_gom !== undefined ? khong_bao_gom : undefined,
        dieu_kien,
        so_cho_toi_da: so_cho_toi_da ? parseInt(so_cho_toi_da) : undefined,
        so_cho_trong: so_cho_trong !== undefined ? parseInt(so_cho_trong) : undefined,
        trang_thai,
        hinh_anh_chinh,
      },
      include: {
        images: true,
      },
    });

    // Update images if provided
    if (images !== undefined) {
      // Delete existing images
      await prisma.tourImage.deleteMany({
        where: { tour_id: parseInt(id) },
      });

      // Create new images
      if (images.length > 0) {
        await prisma.tourImage.createMany({
          data: images.map((img: any, index: number) => ({
            tour_id: parseInt(id),
            url: img.url,
            alt_text: img.alt_text,
            thu_tu: index,
          })),
        });
      }
    }

    const updatedTour = await prisma.tour.findUnique({
      where: { id: parseInt(id) },
      include: {
        images: {
          orderBy: { thu_tu: "asc" },
        },
      },
    });

    return NextResponse.json({ tour: updatedTour });
  } catch (error) {
    console.error("Error updating tour:", error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật tour" },
      { status: 500 }
    );
  }
}

// DELETE /api/tours/[id] - Xóa tour (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tour = await prisma.tour.findUnique({
      where: { id: parseInt(id) },
    });

    if (!tour) {
      return NextResponse.json(
        { error: "Không tìm thấy tour" },
        { status: 404 }
      );
    }

    await prisma.tour.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Xóa tour thành công" });
  } catch (error) {
    console.error("Error deleting tour:", error);
    return NextResponse.json(
      { error: "Lỗi khi xóa tour" },
      { status: 500 }
    );
  }
}

