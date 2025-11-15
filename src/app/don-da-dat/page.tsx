"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import PublicNavbar from "@/components/layout/PublicNavbar";
import Link from "next/link";
import Image from "next/image";

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
    hinh_anh_chinh: string | null;
    images?: Array<{ url: string }>;
  };
}

export default function MyBookingsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["my-bookings", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const res = await fetch(`/api/bookings?userId=${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json();
    },
    enabled: !!user?.id,
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

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      cho_xac_nhan: { label: "Chờ xác nhận", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" },
      da_xac_nhan: { label: "Đã xác nhận", className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" },
      da_huy: { label: "Đã hủy", className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" },
      da_hoan_tat: { label: "Đã hoàn tất", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400" },
    };

    const statusInfo = statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800" };

    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getImageUrl = (booking: Booking) => {
    if (booking.tour.hinh_anh_chinh) return booking.tour.hinh_anh_chinh;
    if (booking.tour.images && booking.tour.images.length > 0) {
      return booking.tour.images[0].url;
    }
    return "/images/cards/card-01.jpg";
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PublicNavbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Đơn đã đặt
          </h1>

          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">Có lỗi xảy ra khi tải danh sách đơn đặt</p>
            </div>
          )}

          {data && data.bookings && (
            <>
              {data.bookings.length > 0 ? (
                <div className="space-y-4">
                  {data.bookings.map((booking: Booking) => (
                    <div
                      key={booking.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={getImageUrl(booking)}
                              alt={booking.tour.ten_tour}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <Link
                                  href={`/tours/${booking.tour.id}`}
                                  className="text-xl font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors"
                                >
                                  {booking.tour.ten_tour}
                                </Link>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  Mã đơn: #{booking.id}
                                </p>
                              </div>
                              {getStatusBadge(booking.trang_thai)}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Người đặt</p>
                                <p className="font-medium text-gray-900 dark:text-white">{booking.ho_ten}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                <p className="font-medium text-gray-900 dark:text-white">{booking.email}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Số điện thoại</p>
                                <p className="font-medium text-gray-900 dark:text-white">{booking.so_dien_thoai}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Ngày khởi hành</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {formatDate(booking.ngay_khoi_hanh)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Số người</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {booking.so_nguoi_lon} người lớn
                                  {booking.so_tre_em > 0 && `, ${booking.so_tre_em} trẻ em`}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Tổng tiền</p>
                                <p className="text-xl font-bold text-primary">
                                  {formatPrice(booking.tong_tien)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Đặt ngày: {formatDate(booking.created_at)}
                              </p>
                              <Link
                                href={`/tours/${booking.tour.id}`}
                                className="text-primary hover:underline text-sm font-medium"
                              >
                                Xem chi tiết tour →
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Bạn chưa có đơn đặt tour nào
                  </p>
                  <Link
                    href="/tours"
                    className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Đặt tour ngay
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

