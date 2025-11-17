"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Save,
  Loader2,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import { AlertModal } from "@/components/ui/AlertModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface BookingDetail {
  id: number;
  ho_ten: string;
  email: string;
  so_dien_thoai: string;
  dia_chi: string | null;
  so_nguoi_lon: number;
  so_tre_em: number;
  ngay_khoi_hanh: string;
  tong_tien: number;
  trang_thai: string;
  ghi_chu: string | null;
  created_at: string;
  tour: {
    id: number;
    ten_tour: string;
    mo_ta_ngan: string | null;
    diem_den: string;
    diem_khoi_hanh: string;
    so_ngay: number;
    so_dem: number;
    gia_nguoi_lon: number;
    gia_tre_em: number | null;
    hinh_anh_chinh: string | null;
    images: Array<{ url: string; alt_text: string | null }>;
  };
  nguoi_dung: {
    id: number;
    ho_ten: string;
    email: string;
  } | null;
}

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const { showSuccess, showError, showConfirm, alertState, confirmState, closeAlert, closeConfirm } = useAlert();
  const bookingId = parseInt(params.id as string);
  const [isEditing, setIsEditing] = useState(false);
  const [ghiChu, setGhiChu] = useState("");
  const [trangThai, setTrangThai] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      const res = await fetch(`/api/bookings/${bookingId}`);
      if (!res.ok) throw new Error("Failed to fetch booking");
      return res.json();
    },
  });

  const booking: BookingDetail | null = data?.booking;

  // Initialize form when data loads
  useEffect(() => {
    if (booking) {
      setGhiChu(booking.ghi_chu || "");
      setTrangThai(booking.trang_thai);
    }
  }, [booking]);

  const updateMutation = useMutation({
    mutationFn: async (data: { trang_thai?: string; ghi_chu?: string }) => {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update booking");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      setIsEditing(false);
      showSuccess("Cập nhật booking thành công!");
    },
    onError: (error: any) => {
      showError(error.message || "Có lỗi xảy ra");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete booking");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      router.push("/admin/bookings");
    },
    onError: (error: any) => {
      showError(error.message || "Có lỗi xảy ra");
    },
  });

  const handleSave = () => {
    const updateData: any = {};
    if (trangThai !== booking?.trang_thai) {
      updateData.trang_thai = trangThai;
    }
    if (ghiChu !== booking?.ghi_chu) {
      updateData.ghi_chu = ghiChu;
    }
    updateMutation.mutate(updateData);
  };

  const handleDelete = () => {
    showConfirm(
      "Bạn có chắc chắn muốn xóa booking này? Hành động này không thể hoàn tác.",
      "Xác nhận xóa booking",
      () => {
        deleteMutation.mutate();
      },
      "danger",
      "Xóa",
      "Hủy"
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      cho_xac_nhan: "Chờ xác nhận",
      da_xac_nhan: "Đã xác nhận",
      da_huy: "Đã hủy",
      da_hoan_tat: "Đã hoàn tất",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      cho_xac_nhan:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      da_xac_nhan:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      da_huy: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      da_hoan_tat:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Không tìm thấy booking
        </p>
        <Link
          href="/admin/bookings"
          className="mt-4 text-primary hover:underline"
        >
          Quay lại danh sách bookings
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
            href="/admin/bookings"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Chi tiết Booking #{booking.id}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {formatDateTime(booking.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Chỉnh sửa
              </button>
              {booking.trang_thai !== "da_huy" && (
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Xóa"
                  )}
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setGhiChu(booking.ghi_chu || "");
                  setTrangThai(booking.trang_thai);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Lưu
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tour Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-start gap-4 mb-4">
              {booking.tour.hinh_anh_chinh || booking.tour.images?.[0]?.url ? (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={
                      booking.tour.hinh_anh_chinh ||
                      booking.tour.images[0].url ||
                      "/images/cards/card-01.jpg"
                    }
                    alt={booking.tour.ten_tour}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div className="flex-1">
                <Link
                  href={`/tours/${booking.tour.id}`}
                  target="_blank"
                  className="text-xl font-bold text-primary hover:underline"
                >
                  {booking.tour.ten_tour}
                </Link>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>📍 {booking.tour.diem_den}</span>
                  <span>🚌 {booking.tour.diem_khoi_hanh}</span>
                  <span>
                    📅 {booking.tour.so_ngay}N/{booking.tour.so_dem}Đ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Thông tin khách hàng
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Họ tên</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {booking.ho_ten}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {booking.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Số điện thoại
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {booking.so_dien_thoai}
                  </p>
                </div>
              </div>
              {booking.dia_chi && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Địa chỉ</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {booking.dia_chi}
                    </p>
                  </div>
                </div>
              )}
              {booking.nguoi_dung && (
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Tài khoản
                    </p>
                    <p className="font-medium text-primary">
                      {booking.nguoi_dung.ho_ten} (ID: {booking.nguoi_dung.id})
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Chi tiết đặt tour
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Ngày khởi hành
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(booking.ngay_khoi_hanh)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Số người</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {booking.so_nguoi_lon} người lớn
                    {booking.so_tre_em > 0 && `, ${booking.so_tre_em} trẻ em`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tổng tiền</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(booking.tong_tien)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Trạng thái
            </h2>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={trangThai}
                    onChange={(e) => setTrangThai(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="cho_xac_nhan">Chờ xác nhận</option>
                    <option value="da_xac_nhan">Đã xác nhận</option>
                    <option value="da_huy">Đã hủy</option>
                    <option value="da_hoan_tat">Đã hoàn tất</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    value={ghiChu}
                    onChange={(e) => setGhiChu(e.target.value)}
                    rows={4}
                    placeholder="Ghi chú về booking..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                      booking.trang_thai
                    )}`}
                  >
                    {getStatusLabel(booking.trang_thai)}
                  </span>
                </div>
                {booking.ghi_chu && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Ghi chú
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {booking.ghi_chu}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Thao tác nhanh
            </h2>
            <div className="space-y-2">
              {booking.trang_thai === "cho_xac_nhan" && (
                <button
                  onClick={() => {
                    setTrangThai("da_xac_nhan");
                    updateMutation.mutate({ trang_thai: "da_xac_nhan" });
                  }}
                  disabled={updateMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  Xác nhận booking
                </button>
              )}
              {booking.trang_thai !== "da_huy" &&
                booking.trang_thai !== "da_hoan_tat" && (
                  <button
                    onClick={() => {
                      showConfirm(
                        "Bạn có chắc chắn muốn hủy booking này?",
                        "Xác nhận hủy",
                        () => {
                          setTrangThai("da_huy");
                          updateMutation.mutate({ trang_thai: "da_huy" });
                        },
                        "warning"
                      );
                    }}
                    disabled={updateMutation.isPending}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    Hủy booking
                  </button>
                )}
              {booking.trang_thai === "da_xac_nhan" && (
                <button
                  onClick={() => {
                    setTrangThai("da_hoan_tat");
                    updateMutation.mutate({ trang_thai: "da_hoan_tat" });
                  }}
                  disabled={updateMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  Đánh dấu hoàn tất
                </button>
              )}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Chi tiết giá
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {booking.so_nguoi_lon} × Người lớn
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatPrice(booking.so_nguoi_lon * booking.tour.gia_nguoi_lon)}
                </span>
              </div>
              {booking.so_tre_em > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {booking.so_tre_em} × Trẻ em
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatPrice(
                      booking.so_tre_em *
                        (booking.tour.gia_tre_em ||
                          booking.tour.gia_nguoi_lon * 0.7)
                    )}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Tổng cộng
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(booking.tong_tien)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Modal */}
      <AlertModal
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        onConfirm={alertState.onConfirm}
        confirmText={alertState.confirmText}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmState.onConfirm || (() => {})}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        type={confirmState.type}
      />
    </div>
  );
}

