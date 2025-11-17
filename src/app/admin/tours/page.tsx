"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Loader2,
  Filter,
  X,
} from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import { useToast } from "@/context/ToastContext";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface Tour {
  id: number;
  ten_tour: string;
  mo_ta_ngan: string | null;
  gia_nguoi_lon: number;
  so_ngay: number;
  so_dem: number;
  diem_den: string;
  trang_thai: string;
  so_cho_trong: number;
  so_cho_toi_da: number;
  hinh_anh_chinh: string | null;
  images: Array<{ id: number; url: string; alt_text: string | null }>;
  created_at: string;
}

export default function AdminToursPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showConfirm, confirmState, closeConfirm } = useAlert();
  const { success, error } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading } = useQuery({
    queryKey: ["admin-tours", page, search, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) params.append("search", search);
      if (statusFilter !== "all") params.append("trang_thai", statusFilter);

      const res = await fetch(`/api/tours?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch tours");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/tours/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete tour");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tours"] });
      success("Xóa tour thành công!");
    },
    onError: (err: any) => {
      error(err.message || "Có lỗi xảy ra khi xóa tour");
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      dang_ban: "Đang bán",
      tam_dung: "Tạm dừng",
      het_cho: "Hết chỗ",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      dang_ban: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      tam_dung: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      het_cho: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const handleDelete = (id: number, tenTour: string) => {
    showConfirm(
      `Bạn có chắc chắn muốn xóa tour "${tenTour}"?`,
      "Xác nhận xóa tour",
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
            Quản lý Tours
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý tất cả các tour trong hệ thống
          </p>
        </div>
        <Link
          href="/admin/tours/create"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tạo tour mới
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tour..."
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
              <option value="dang_ban">Đang bán</option>
              <option value="tam_dung">Tạm dừng</option>
              <option value="het_cho">Hết chỗ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tours List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : data?.tours?.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Không tìm thấy tour nào
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.tours?.map((tour: Tour) => (
              <div
                key={tour.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={
                      tour.hinh_anh_chinh ||
                      tour.images?.[0]?.url ||
                      "/images/cards/card-01.jpg"
                    }
                    alt={tour.ten_tour}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        tour.trang_thai
                      )}`}
                    >
                      {getStatusLabel(tour.trang_thai)}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {tour.ten_tour}
                  </h3>
                  {tour.mo_ta_ngan && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {tour.mo_ta_ngan}
                    </p>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Điểm đến
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {tour.diem_den}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Thời gian
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {tour.so_ngay}N/{tour.so_dem}Đ
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(tour.gia_nguoi_lon)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Chỗ trống
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {tour.so_cho_trong}/{tour.so_cho_toi_da}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      href={`/tours/${tour.id}`}
                      target="_blank"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Xem
                    </Link>
                    <Link
                      href={`/admin/tours/${tour.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(tour.id, tour.ten_tour)}
                      disabled={deleteMutation.isPending}
                      className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
                Trang {page} / {data.pagination.totalPages}
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

