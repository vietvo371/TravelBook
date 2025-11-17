-- CreateTable
CREATE TABLE "Blog" (
    "id" SERIAL NOT NULL,
    "tieu_de" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "mo_ta_ngan" TEXT,
    "noi_dung" TEXT NOT NULL,
    "hinh_anh" TEXT,
    "tac_gia_id" INTEGER,
    "danh_muc" TEXT,
    "tags" TEXT[],
    "luot_xem" INTEGER NOT NULL DEFAULT 0,
    "trang_thai" TEXT NOT NULL DEFAULT 'draft',
    "ngay_dang" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_tac_gia_id_fkey" FOREIGN KEY ("tac_gia_id") REFERENCES "NguoiDung"("id") ON DELETE SET NULL ON UPDATE CASCADE;
