-- CreateTable
CREATE TABLE "NguoiDung" (
    "id" SERIAL NOT NULL,
    "ho_ten" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mat_khau" TEXT NOT NULL,
    "so_dien_thoai" TEXT,
    "vai_tro" TEXT NOT NULL DEFAULT 'khach_hang',
    "dia_chi" TEXT,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NguoiDung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "nguoi_dung_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "loai_token" TEXT NOT NULL DEFAULT 'access_token',
    "het_han" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThongBao" (
    "id" SERIAL NOT NULL,
    "nguoi_dung_id" INTEGER,
    "booking_id" INTEGER,
    "tieu_de" TEXT NOT NULL,
    "noi_dung" TEXT NOT NULL,
    "loai" TEXT NOT NULL DEFAULT 'thong_bao',
    "da_doc" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ThongBao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tour" (
    "id" SERIAL NOT NULL,
    "ten_tour" TEXT NOT NULL,
    "mo_ta" TEXT,
    "mo_ta_ngan" TEXT,
    "gia_nguoi_lon" DOUBLE PRECISION NOT NULL,
    "gia_tre_em" DOUBLE PRECISION,
    "so_ngay" INTEGER NOT NULL,
    "so_dem" INTEGER NOT NULL,
    "diem_khoi_hanh" TEXT NOT NULL,
    "diem_den" TEXT NOT NULL,
    "phuong_tien" TEXT NOT NULL,
    "khach_san" TEXT,
    "lich_trinh" JSONB,
    "bao_gom" TEXT[],
    "khong_bao_gom" TEXT[],
    "dieu_kien" TEXT,
    "trang_thai" TEXT NOT NULL DEFAULT 'dang_ban',
    "so_cho_trong" INTEGER NOT NULL DEFAULT 0,
    "so_cho_toi_da" INTEGER NOT NULL,
    "hinh_anh_chinh" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TourImage" (
    "id" SERIAL NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "alt_text" TEXT,
    "thu_tu" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TourImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "nguoi_dung_id" INTEGER,
    "ho_ten" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "so_dien_thoai" TEXT NOT NULL,
    "dia_chi" TEXT,
    "so_nguoi_lon" INTEGER NOT NULL DEFAULT 1,
    "so_tre_em" INTEGER NOT NULL DEFAULT 0,
    "ngay_khoi_hanh" TIMESTAMP(3) NOT NULL,
    "ghi_chu" TEXT,
    "tong_tien" DOUBLE PRECISION NOT NULL,
    "trang_thai" TEXT NOT NULL DEFAULT 'cho_xac_nhan',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NguoiDung_email_key" ON "NguoiDung"("email");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_nguoi_dung_id_fkey" FOREIGN KEY ("nguoi_dung_id") REFERENCES "NguoiDung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThongBao" ADD CONSTRAINT "ThongBao_nguoi_dung_id_fkey" FOREIGN KEY ("nguoi_dung_id") REFERENCES "NguoiDung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThongBao" ADD CONSTRAINT "ThongBao_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourImage" ADD CONSTRAINT "TourImage_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "Tour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_nguoi_dung_id_fkey" FOREIGN KEY ("nguoi_dung_id") REFERENCES "NguoiDung"("id") ON DELETE SET NULL ON UPDATE CASCADE;
