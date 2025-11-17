"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  User,
  DollarSign,
  Trash2,
} from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import { AlertModal } from "@/components/ui/AlertModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface Booking {
  id: number;
  ho_ten: string;
  email: string;
  so_dien_thoai: string;
  so_nguoi_lon: number;
  so_tre_em: number;
  ngay_khoi_hanh: string;
  tong_tien: number;
  trang_thai: string;
  created_at: string;
  tour: {
    id: number;
    ten_tour: string;
    diem_den: string;
    images: Array<{ url: string }>;
  };
  nguoi_dung: {
    id: number;
    ho_ten: string;
    email: string;
  } | null;
}

export default function AdminBookingsPage() {
  const queryClient = useQueryClient();
  const { showSuccess, showError, showConfirm, alertState, confirmState, closeAlert, closeConfirm } = useAlert();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ["admin-bookings", page, search, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      // Note: API doesn't support search yet, but we can filter client-side
      if (statusFilter !== "all") params.append("trang_thai", statusFilter);

      const res = await fetch(`/api/bookings?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const result = await res.json();
      
      // Client-side search filter
      if (search) {
        const searchLower = search.toLowerCase();
        result.bookings = result.bookings.filter((booking: Booking) => {
          return (
            booking.ho_ten.toLowerCase().includes(searchLower) ||
            booking.email.toLowerCase().includes(searchLower) ||
            booking.so_dien_thoai.includes(search) ||
            booking.tour.ten_tour.toLowerCase().includes(searchLower) ||
            booking.tour.diem_den.toLowerCase().includes(searchLower)
          );
        });
        // Recalculate pagination for filtered results
        result.pagination.total = result.bookings.length;
        result.pagination.totalPages = Math.ceil(result.bookings.length / limit);
        // Apply pagination to filtered results
        const start = (page - 1) * limit;
        const end = start + limit;
        result.bookings = result.bookings.slice(start, end);
      }
      
      return result;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      trang_thai,
    }: {
      id: number;
      trang_thai: string;
    }) => {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trang_thai }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update booking");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin-statistics"] });
      showSuccess("Cập nhật trạng thái thành công!");
    },
    onError: (error: any) => {
      showError(error.message || "Có lỗi xảy ra");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/bookings/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin-statistics"] });
      showSuccess("Xóa booking thành công!");
    },
    onError: (error: any) => {
      showError(error.message || "Có lỗi xảy ra khi xóa booking");
    },
  });

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

  const handleStatusChange = (id: number, newStatus: string) => {
    showConfirm(
      "Bạn có chắc chắn muốn cập nhật trạng thái?",
      "Xác nhận cập nhật",
      () => {
        updateStatusMutation.mutate({ id, trang_thai: newStatus });
      },
      "warning"
    );
  };

  const handleDelete = (id: number, hoTen: string) => {
    showConfirm(
      `Bạn có chắc chắn muốn xóa booking của "${hoTen}"? Hành động này không thể hoàn tác.`,
      "Xác nhận xóa booking",
      () => {
        deleteMutation.mutate(id);
      },
      "danger",
      "Xóa",
      "Hủy"
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Quản lý Bookings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý tất cả các đặt tour trong hệ thống
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="cho_xac_nhan">Chờ xác nhận</option>
              <option value="da_xac_nhan">Đã xác nhận</option>
              <option value="da_huy">Đã hủy</option>
              <option value="da_hoan_tat">Đã hoàn tất</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : data?.bookings?.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Không tìm thấy booking nào
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Booking
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tour
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Ngày khởi hành
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Số người
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tổng tiền
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {data?.bookings?.map((booking: Booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            #{booking.id}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(booking.created_at)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/tours/${booking.tour.id}`}
                          target="_blank"
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          {booking.tour.ten_tour}
                        </Link>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {booking.tour.diem_den}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {booking.ho_ten}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {booking.email}
                          </p>
                          {booking.nguoi_dung && (
                            <p className="text-xs text-primary">
                              User ID: {booking.nguoi_dung.id}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {formatDate(booking.ngay_khoi_hanh)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          <p>NL: {booking.so_nguoi_lon}</p>
                          {booking.so_tre_em > 0 && (
                            <p className="text-xs text-gray-500">TE: {booking.so_tre_em}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {formatPrice(booking.tong_tien)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            booking.trang_thai
                          )}`}
                        >
                          {getStatusLabel(booking.trang_thai)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/bookings/${booking.id}`}
                            className="text-primary hover:text-primary/80"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {booking.trang_thai === "cho_xac_nhan" && (
                            <button
                              onClick={() =>
                                handleStatusChange(booking.id, "da_xac_nhan")
                              }
                              disabled={updateStatusMutation.isPending}
                              className="text-green-600 hover:text-green-800 disabled:opacity-50"
                              title="Xác nhận"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {booking.trang_thai !== "da_huy" &&
                            booking.trang_thai !== "da_hoan_tat" && (
                              <button
                                onClick={() =>
                                  handleStatusChange(booking.id, "da_huy")
                                }
                                disabled={updateStatusMutation.isPending}
                                className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                title="Hủy"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          <button
                            onClick={() => handleDelete(booking.id, booking.ho_ten)}
                            disabled={deleteMutation.isPending}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                            title="Xóa"
                          >
                            {deleteMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
              >
                Trước
              </button>
              <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                Trang {page} / {data.pagination.totalPages} (Tổng:{" "}
                {data.pagination.total})
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(data.pagination.totalPages, p + 1))
                }
                disabled={page === data.pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}

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

