"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, RefreshCw, Plane, BookOpen, Users, DollarSign, TrendingUp, Calendar, ArrowUpRight, ArrowRight, MapPin } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";

interface DashboardStats {
  totalTours: number;
  totalBookings: number;
  totalUsers: number;
  totalRevenue: number;
  tourStatusStats: Array<{ trang_thai: string; _count: { id: number } }>;
  bookingStatusStats: Array<{ trang_thai: string; _count: { id: number } }>;
  timeSeries: Array<{ date: string; count: number }>;
  topTours: Array<{
    tour_id: number;
    ten_tour: string;
    diem_den: string;
    so_luot_dat: number;
    tong_doanh_thu: number;
  }>;
}

export default function DashboardPage() {
  const { success, error } = useToast();
  const { data, isLoading, refetch } = useQuery<{ statistics: DashboardStats }>({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/admin/statistics");
      if (!res.ok) throw new Error("Failed to fetch statistics");
      return res.json();
    },
  });

  const handleRefresh = async () => {
    try {
      await refetch();
      success("Làm mới dữ liệu thành công!");
    } catch (err: any) {
      error(err.message || "Có lỗi xảy ra khi làm mới dữ liệu");
    }
  };

  const stats = data?.statistics;

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
      cho_xac_nhan: "Chờ xác nhận",
      da_xac_nhan: "Đã xác nhận",
      da_huy: "Đã hủy",
      da_hoan_tat: "Đã hoàn tất",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      dang_ban: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      tam_dung: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      het_cho: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      cho_xac_nhan: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      da_xac_nhan: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      da_huy: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      da_hoan_tat: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    };
    return colors[status] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Quản Trị
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tổng quan hệ thống TravelBook
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all hover:shadow-lg active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Làm mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Tours Card */}
        <Link
          href="/admin/tours"
          className="group bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-blue-200/50 dark:border-blue-800/30 hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl group-hover:scale-110 transition-transform">
              <Plane className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Tổng số Tours</p>
            <p className="text-4xl font-bold text-blue-900 dark:text-blue-100">
              {stats?.totalTours || 0}
            </p>
          </div>
        </Link>

        {/* Bookings Card */}
        <Link
          href="/admin/bookings"
          className="group bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-green-200/50 dark:border-green-800/30 hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/10 dark:bg-green-500/20 rounded-xl group-hover:scale-110 transition-transform">
              <BookOpen className="w-7 h-7 text-green-600 dark:text-green-400" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Tổng số Bookings</p>
            <p className="text-4xl font-bold text-green-900 dark:text-green-100">
              {stats?.totalBookings || 0}
            </p>
          </div>
        </Link>

        {/* Users Card */}
        <Link
          href="/admin/users"
          className="group bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-purple-200/50 dark:border-purple-800/30 hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/10 dark:bg-purple-500/20 rounded-xl group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">Tổng số Users</p>
            <p className="text-4xl font-bold text-purple-900 dark:text-purple-100">
              {stats?.totalUsers || 0}
            </p>
          </div>
        </Link>

        {/* Revenue Card */}
        <Link
          href="/admin/statistics"
          className="group bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-amber-200/50 dark:border-amber-800/30 hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-500/10 dark:bg-amber-500/20 rounded-xl group-hover:scale-110 transition-transform">
              <DollarSign className="w-7 h-7 text-amber-600 dark:text-amber-400" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-amber-600 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">Tổng doanh thu</p>
            <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
              {stats?.totalRevenue ? formatPrice(stats.totalRevenue) : "0 ₫"}
            </p>
          </div>
        </Link>
      </div>

      {/* Status Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tour Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Plane className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Trạng thái Tours
            </h2>
          </div>
          <div className="space-y-4">
            {stats?.tourStatusStats.map((stat) => {
              const total = stats.tourStatusStats.reduce((sum, s) => sum + s._count.id, 0);
              const percentage = total > 0 ? (stat._count.id / total) * 100 : 0;
              return (
                <div key={stat.trang_thai} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {getStatusLabel(stat.trang_thai)}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(stat.trang_thai)}`}>
                        {getStatusLabel(stat.trang_thai)}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {stat._count.id}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        stat.trang_thai === "dang_ban"
                          ? "bg-gradient-to-r from-green-500 to-green-600"
                          : stat.trang_thai === "tam_dung"
                          ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                          : "bg-gradient-to-r from-red-500 to-red-600"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Booking Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Trạng thái Bookings
            </h2>
          </div>
          <div className="space-y-4">
            {stats?.bookingStatusStats.map((stat) => {
              const total = stats.bookingStatusStats.reduce((sum, s) => sum + s._count.id, 0);
              const percentage = total > 0 ? (stat._count.id / total) * 100 : 0;
              return (
                <div key={stat.trang_thai} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {getStatusLabel(stat.trang_thai)}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(stat.trang_thai)}`}>
                        {getStatusLabel(stat.trang_thai)}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {stat._count.id}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        stat.trang_thai === "da_xac_nhan" || stat.trang_thai === "da_hoan_tat"
                          ? "bg-gradient-to-r from-green-500 to-green-600"
                          : stat.trang_thai === "cho_xac_nhan"
                          ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                          : "bg-gradient-to-r from-red-500 to-red-600"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Tours */}
      {stats?.topTours && stats.topTours.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Top Tours được đặt nhiều nhất
              </h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Tour
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Điểm đến
                  </th>
                  <th className="text-right py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Số lượt đặt
                  </th>
                  <th className="text-right py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Doanh thu
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.topTours.map((tour, index) => (
                  <tr
                    key={tour.tour_id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent dark:hover:from-gray-700/50 dark:hover:to-transparent transition-all duration-200"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary font-bold text-sm">
                          {index + 1}
                        </div>
                        <Link
                          href={`/admin/tours/${tour.tour_id}`}
                          className="text-primary hover:underline font-semibold transition-colors"
                        >
                          {tour.ten_tour}
                        </Link>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{tour.diem_den}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-gray-900 dark:text-white">
                        <Users className="w-4 h-4 text-gray-400" />
                        {tour.so_luot_dat}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm font-bold text-primary">
                        {formatPrice(tour.tong_doanh_thu)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Thao tác nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/tours/create"
            className="group relative flex items-center gap-4 p-5 border-2 border-blue-200 dark:border-blue-800 rounded-xl hover:border-blue-400 dark:hover:border-blue-600 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-800 hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-3 bg-blue-500 rounded-xl group-hover:scale-110 transition-transform">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div className="relative flex-1">
              <p className="font-bold text-gray-900 dark:text-white mb-1">Tạo tour mới</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Thêm tour mới vào hệ thống</p>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/admin/bookings"
            className="group relative flex items-center gap-4 p-5 border-2 border-green-200 dark:border-green-800 rounded-xl hover:border-green-400 dark:hover:border-green-600 bg-gradient-to-br from-green-50 to-white dark:from-green-900/10 dark:to-gray-800 hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-3 bg-green-500 rounded-xl group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="relative flex-1">
              <p className="font-bold text-gray-900 dark:text-white mb-1">Quản lý bookings</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Xem và xử lý đặt tour</p>
            </div>
            <ArrowRight className="w-5 h-5 text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/admin/statistics"
            className="group relative flex items-center gap-4 p-5 border-2 border-purple-200 dark:border-purple-800 rounded-xl hover:border-purple-400 dark:hover:border-purple-600 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/10 dark:to-gray-800 hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-3 bg-purple-500 rounded-xl group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="relative flex-1">
              <p className="font-bold text-gray-900 dark:text-white mb-1">Xem thống kê</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Phân tích dữ liệu chi tiết</p>
            </div>
            <ArrowRight className="w-5 h-5 text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
