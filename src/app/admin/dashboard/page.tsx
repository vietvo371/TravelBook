"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, RefreshCw, Plane, BookOpen, Users, DollarSign, TrendingUp, Calendar } from "lucide-react";
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
  const { data, isLoading, refetch } = useQuery<{ statistics: DashboardStats }>({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/admin/statistics");
      if (!res.ok) throw new Error("Failed to fetch statistics");
      return res.json();
    },
  });

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
    <div className="space-y-6">
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
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Làm mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tổng số Tours</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats?.totalTours || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Plane className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <Link
            href="/admin/tours"
            className="text-sm text-primary hover:underline mt-4 inline-block"
          >
            Xem tất cả →
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tổng số Bookings</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats?.totalBookings || 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <Link
            href="/admin/bookings"
            className="text-sm text-primary hover:underline mt-4 inline-block"
          >
            Xem tất cả →
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tổng số Users</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats?.totalUsers || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <Link
            href="/admin/users"
            className="text-sm text-primary hover:underline mt-4 inline-block"
          >
            Xem tất cả →
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tổng doanh thu</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats?.totalRevenue ? formatPrice(stats.totalRevenue) : "0 ₫"}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <Link
            href="/admin/statistics"
            className="text-sm text-primary hover:underline mt-4 inline-block"
          >
            Xem chi tiết →
          </Link>
        </div>
      </div>

      {/* Status Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tour Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Trạng thái Tours
          </h2>
          <div className="space-y-3">
            {stats?.tourStatusStats.map((stat) => (
              <div key={stat.trang_thai} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {getStatusLabel(stat.trang_thai)}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stat._count.id}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(stat.trang_thai)}`}>
                    {stat.trang_thai}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Trạng thái Bookings
          </h2>
          <div className="space-y-3">
            {stats?.bookingStatusStats.map((stat) => (
              <div key={stat.trang_thai} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {getStatusLabel(stat.trang_thai)}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stat._count.id}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(stat.trang_thai)}`}>
                    {stat.trang_thai}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Tours */}
      {stats?.topTours && stats.topTours.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Top Tours được đặt nhiều nhất
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tour
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Điểm đến
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Số lượt đặt
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Doanh thu
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.topTours.map((tour) => (
                  <tr
                    key={tour.tour_id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-3 px-4">
                      <Link
                        href={`/admin/tours/${tour.tour_id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {tour.ten_tour}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {tour.diem_den}
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                      {tour.so_luot_dat}
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-semibold text-primary">
                      {formatPrice(tour.tong_doanh_thu)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Thao tác nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/tours?action=create"
            className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Plane className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Tạo tour mới</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Thêm tour mới vào hệ thống</p>
            </div>
          </Link>

          <Link
            href="/admin/bookings"
            className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Quản lý bookings</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Xem và xử lý đặt tour</p>
            </div>
          </Link>

          <Link
            href="/admin/statistics"
            className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Xem thống kê</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Phân tích dữ liệu chi tiết</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
