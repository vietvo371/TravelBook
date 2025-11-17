"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Plus, Trash2, Loader2, Upload } from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import { useToast } from "@/context/ToastContext";
import Image from "next/image";

interface ImageItem {
  url: string;
  alt_text: string;
}

export default function EditTourPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const { success, error, warning } = useToast();
  const tourId = parseInt(params.id as string);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<Record<number, boolean>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["tour", tourId],
    queryFn: async () => {
      const res = await fetch(`/api/tours/${tourId}`);
      if (!res.ok) throw new Error("Failed to fetch tour");
      return res.json();
    },
  });

  const [formData, setFormData] = useState({
    ten_tour: "",
    mo_ta: "",
    mo_ta_ngan: "",
    gia_nguoi_lon: "",
    gia_tre_em: "",
    so_ngay: "",
    so_dem: "",
    diem_khoi_hanh: "",
    diem_den: "",
    phuong_tien: "",
    khach_san: "",
    lich_trinh: "",
    bao_gom: [""],
    khong_bao_gom: [""],
    dieu_kien: "",
    so_cho_toi_da: "",
    so_cho_trong: "",
    trang_thai: "dang_ban",
    hinh_anh_chinh: "",
    images: [] as ImageItem[],
  });

  // Populate form when tour data is loaded
  useEffect(() => {
    if (data?.tour) {
      const tour = data.tour;
      setFormData({
        ten_tour: tour.ten_tour || "",
        mo_ta: tour.mo_ta || "",
        mo_ta_ngan: tour.mo_ta_ngan || "",
        gia_nguoi_lon: tour.gia_nguoi_lon?.toString() || "",
        gia_tre_em: tour.gia_tre_em?.toString() || "",
        so_ngay: tour.so_ngay?.toString() || "",
        so_dem: tour.so_dem?.toString() || "",
        diem_khoi_hanh: tour.diem_khoi_hanh || "",
        diem_den: tour.diem_den || "",
        phuong_tien: tour.phuong_tien || "",
        khach_san: tour.khach_san || "",
        lich_trinh:
          typeof tour.lich_trinh === "string"
            ? tour.lich_trinh
            : Array.isArray(tour.lich_trinh)
            ? tour.lich_trinh.join("\n")
            : JSON.stringify(tour.lich_trinh, null, 2),
        bao_gom: tour.bao_gom && tour.bao_gom.length > 0 ? tour.bao_gom : [""],
        khong_bao_gom:
          tour.khong_bao_gom && tour.khong_bao_gom.length > 0
            ? tour.khong_bao_gom
            : [""],
        dieu_kien: tour.dieu_kien || "",
        so_cho_toi_da: tour.so_cho_toi_da?.toString() || "",
        so_cho_trong: tour.so_cho_trong?.toString() || "",
        trang_thai: tour.trang_thai || "dang_ban",
        hinh_anh_chinh: tour.hinh_anh_chinh || "",
        images:
          tour.images && tour.images.length > 0
            ? tour.images.map((img: any) => ({
                url: img.url || "",
                alt_text: img.alt_text || "",
              }))
            : [],
      });
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/tours/${tourId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update tour");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tours"] });
      queryClient.invalidateQueries({ queryKey: ["tour", tourId] });
      success("Cập nhật tour thành công!");
      router.push("/admin/tours");
    },
    onError: (err: any) => {
      error(err.message || "Có lỗi xảy ra khi cập nhật tour");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (
      !formData.ten_tour ||
      !formData.gia_nguoi_lon ||
      !formData.so_ngay ||
      !formData.so_dem ||
      !formData.diem_khoi_hanh ||
      !formData.diem_den ||
      !formData.phuong_tien ||
      !formData.so_cho_toi_da
    ) {
      warning("Vui lòng điền đầy đủ thông tin bắt buộc");
      setIsSubmitting(false);
      return;
    }

    // Process lich_trinh
    let lichTrinhParsed = null;
    if (formData.lich_trinh) {
      try {
        // Try to parse as JSON if it's a JSON string
        lichTrinhParsed = JSON.parse(formData.lich_trinh);
      } catch {
        // If not JSON, treat as plain text and convert to array
        lichTrinhParsed = formData.lich_trinh
          .split("\n")
          .filter((line) => line.trim())
          .map((line) => line.trim());
      }
    }

    const submitData = {
      ...formData,
      gia_nguoi_lon: parseFloat(formData.gia_nguoi_lon),
      gia_tre_em: formData.gia_tre_em ? parseFloat(formData.gia_tre_em) : null,
      so_ngay: parseInt(formData.so_ngay),
      so_dem: parseInt(formData.so_dem),
      so_cho_toi_da: parseInt(formData.so_cho_toi_da),
      so_cho_trong: parseInt(formData.so_cho_trong),
      lich_trinh: lichTrinhParsed,
      bao_gom: formData.bao_gom.filter((item) => item.trim()),
      khong_bao_gom: formData.khong_bao_gom.filter((item) => item.trim()),
      mo_ta: formData.mo_ta || null,
      mo_ta_ngan: formData.mo_ta_ngan || null,
      khach_san: formData.khach_san || null,
      dieu_kien: formData.dieu_kien || null,
      hinh_anh_chinh: formData.hinh_anh_chinh || null,
      images: formData.images.filter((img) => img.url.trim()),
    };

    updateMutation.mutate(submitData);
  };

  const addBaoGom = () => {
    setFormData({
      ...formData,
      bao_gom: [...formData.bao_gom, ""],
    });
  };

  const removeBaoGom = (index: number) => {
    setFormData({
      ...formData,
      bao_gom: formData.bao_gom.filter((_, i) => i !== index),
    });
  };

  const updateBaoGom = (index: number, value: string) => {
    const newBaoGom = [...formData.bao_gom];
    newBaoGom[index] = value;
    setFormData({ ...formData, bao_gom: newBaoGom });
  };

  const addKhongBaoGom = () => {
    setFormData({
      ...formData,
      khong_bao_gom: [...formData.khong_bao_gom, ""],
    });
  };

  const removeKhongBaoGom = (index: number) => {
    setFormData({
      ...formData,
      khong_bao_gom: formData.khong_bao_gom.filter((_, i) => i !== index),
    });
  };

  const updateKhongBaoGom = (index: number, value: string) => {
    const newKhongBaoGom = [...formData.khong_bao_gom];
    newKhongBaoGom[index] = value;
    setFormData({ ...formData, khong_bao_gom: newKhongBaoGom });
  };

  const addImage = () => {
    setFormData({
      ...formData,
      images: [...formData.images, { url: "", alt_text: "" }],
    });
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const updateImage = (index: number, field: "url" | "alt_text", value: string) => {
    const newImages = [...formData.images];
    newImages[index] = { ...newImages[index], [field]: value };
    setFormData({ ...formData, images: newImages });
  };

  const handleImageUpload = async (index: number, file: File) => {
    setUploadingImages({ ...uploadingImages, [index]: true });
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("folder", "tours");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      updateImage(index, "url", data.url);
      success("Upload ảnh thành công!");
    } catch (err: any) {
      error(err.message || "Có lỗi xảy ra khi upload ảnh");
    } finally {
      setUploadingImages({ ...uploadingImages, [index]: false });
    }
  };

  const handleMainImageUpload = async (file: File) => {
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("folder", "tours");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      setFormData({ ...formData, hinh_anh_chinh: data.url });
      success("Upload ảnh chính thành công!");
    } catch (err: any) {
      error(err.message || "Có lỗi xảy ra khi upload ảnh");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data?.tour) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Không tìm thấy tour
        </p>
        <Link
          href="/admin/tours"
          className="mt-4 text-primary hover:underline"
        >
          Quay lại danh sách tours
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/tours"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Chỉnh sửa tour
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {formData.ten_tour || "Cập nhật thông tin tour"}
            </p>
          </div>
        </div>
      </div>

      {/* Form - Same structure as create page */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Thông tin cơ bản
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tên tour <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.ten_tour}
              onChange={(e) => setFormData({ ...formData, ten_tour: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mô tả ngắn
            </label>
            <input
              type="text"
              value={formData.mo_ta_ngan}
              onChange={(e) => setFormData({ ...formData, mo_ta_ngan: e.target.value })}
              placeholder="Mô tả ngắn gọn về tour (hiển thị trên card)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mô tả chi tiết
            </label>
            <textarea
              value={formData.mo_ta}
              onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })}
              rows={5}
              placeholder="Mô tả chi tiết về tour..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        {/* Price & Duration */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Giá và thời gian
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Giá người lớn (VND) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                step="1000"
                value={formData.gia_nguoi_lon}
                onChange={(e) => setFormData({ ...formData, gia_nguoi_lon: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Giá trẻ em (VND)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={formData.gia_tre_em}
                onChange={(e) => setFormData({ ...formData, gia_tre_em: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Số ngày <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.so_ngay}
                onChange={(e) => setFormData({ ...formData, so_ngay: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Số đêm <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.so_dem}
                onChange={(e) => setFormData({ ...formData, so_dem: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Location & Transport */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Địa điểm và phương tiện
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Điểm khởi hành <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.diem_khoi_hanh}
                onChange={(e) => setFormData({ ...formData, diem_khoi_hanh: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Điểm đến <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.diem_den}
                onChange={(e) => setFormData({ ...formData, diem_den: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phương tiện <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.phuong_tien}
                onChange={(e) => setFormData({ ...formData, phuong_tien: e.target.value })}
                placeholder="Ví dụ: Xe du lịch, Máy bay, Tàu..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Khách sạn
              </label>
              <input
                type="text"
                value={formData.khach_san}
                onChange={(e) => setFormData({ ...formData, khach_san: e.target.value })}
                placeholder="Thông tin khách sạn"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Capacity */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Sức chứa
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Số chỗ tối đa <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.so_cho_toi_da}
                onChange={(e) => setFormData({ ...formData, so_cho_toi_da: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Số chỗ trống <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.so_cho_trong}
                onChange={(e) => setFormData({ ...formData, so_cho_trong: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Trạng thái
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Trạng thái tour
            </label>
            <select
              value={formData.trang_thai}
              onChange={(e) => setFormData({ ...formData, trang_thai: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="dang_ban">Đang bán</option>
              <option value="tam_dung">Tạm dừng</option>
              <option value="het_cho">Hết chỗ</option>
            </select>
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Lịch trình
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Lịch trình chi tiết
            </label>
            <textarea
              value={formData.lich_trinh}
              onChange={(e) => setFormData({ ...formData, lich_trinh: e.target.value })}
              rows={6}
              placeholder="Nhập lịch trình, mỗi dòng là một hoạt động. Hoặc nhập JSON array."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Mỗi dòng là một hoạt động, hoặc nhập JSON array
            </p>
          </div>
        </div>

        {/* Services */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Dịch vụ
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dịch vụ bao gồm
            </label>
            {formData.bao_gom.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateBaoGom(index, e.target.value)}
                  placeholder={`Dịch vụ ${index + 1}`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => removeBaoGom(index)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addBaoGom}
              className="flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Thêm dịch vụ
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dịch vụ không bao gồm
            </label>
            {formData.khong_bao_gom.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateKhongBaoGom(index, e.target.value)}
                  placeholder={`Dịch vụ ${index + 1}`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => removeKhongBaoGom(index)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addKhongBaoGom}
              className="flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Thêm dịch vụ
            </button>
          </div>
        </div>

        {/* Conditions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Điều kiện
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Điều kiện hủy/đổi
            </label>
            <textarea
              value={formData.dieu_kien}
              onChange={(e) => setFormData({ ...formData, dieu_kien: e.target.value })}
              rows={4}
              placeholder="Điều kiện hủy và đổi tour..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Hình ảnh
          </h2>

          {/* Main Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hình ảnh chính
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.hinh_anh_chinh}
                  onChange={(e) => setFormData({ ...formData, hinh_anh_chinh: e.target.value })}
                  placeholder="Nhập URL hoặc upload file (tùy chọn)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <label className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleMainImageUpload(file);
                    }}
                  />
                </label>
              </div>
              {formData.hinh_anh_chinh && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
                  <Image
                    src={formData.hinh_anh_chinh}
                    alt="Preview"
                    fill
                    className="object-cover"
                    onError={() => {
                      error("Không thể tải ảnh. Vui lòng kiểm tra URL.");
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Additional Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hình ảnh bổ sung
            </label>
            <div className="space-y-4">
              {formData.images.map((img, index) => (
                <div key={index} className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={img.url}
                      onChange={(e) => updateImage(index, "url", e.target.value)}
                      placeholder="Nhập URL hoặc upload file"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <label className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 cursor-pointer transition-colors disabled:opacity-50">
                      {uploadingImages[index] ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingImages[index]}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(index, file);
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={img.alt_text}
                    onChange={(e) => updateImage(index, "alt_text", e.target.value)}
                    placeholder="Mô tả ảnh (alt text)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  {img.url && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
                      <Image
                        src={img.url}
                        alt={img.alt_text || "Preview"}
                        fill
                        className="object-cover"
                        onError={() => {
                          showError("Không thể tải ảnh. Vui lòng kiểm tra URL.");
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addImage}
                className="flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors border border-dashed border-primary"
              >
                <Plus className="w-4 h-4" />
                Thêm hình ảnh
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/admin/tours"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600 transition-colors"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || updateMutation.isPending}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting || updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Cập nhật tour
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

