"use client";

import { useMemo, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Users, DollarSign, Calendar, TrendingUp, Loader2, RotateCcw } from "lucide-react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface StatisticsData {
  totalTours: number;
  totalBookings: number;
  totalUsers: number;
  totalAdmins: number;
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

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export default function AdminStatisticsPage() {
  // Refs for date inputs
  const fromDateRef = useRef<HTMLInputElement>(null);
  const toDateRef = useRef<HTMLInputElement>(null);

  // Initialize with today's date
  const [filters, setFilters] = useState<{ from: string; to: string }>(() => {
    const today = getTodayDate();
    return {
      from: today,
      to: today,
    };
  });

  // Function to reset to today
  const resetToToday = () => {
    const today = getTodayDate();
    setFilters({
      from: today,
      to: today,
    });
  };

  // Function to open date picker
  const openFromDatePicker = () => {
    fromDateRef.current?.showPicker?.();
  };

  const openToDatePicker = () => {
    toDateRef.current?.showPicker?.();
  };

  const { data, isLoading, error } = useQuery<{ statistics: StatisticsData }>({
    queryKey: ["admin-statistics", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      // Always send date range (default to today if not set)
      const fromDate = filters.from || getTodayDate();
      const toDate = filters.to || getTodayDate();
      
      // Set time to start of day for from and end of day for to
      const fromDateTime = new Date(fromDate);
      fromDateTime.setHours(0, 0, 0, 0);
      
      const toDateTime = new Date(toDate);
      toDateTime.setHours(23, 59, 59, 999);
      
      params.append("thoi_gian_bat_dau", fromDateTime.toISOString());
      params.append("thoi_gian_ket_thuc", toDateTime.toISOString());
      
      const res = await fetch(`/api/admin/statistics?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
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

  // Time Series Chart
  const timeSeriesChartOptions: ApexOptions = useMemo(() => {
    if (!stats?.timeSeries) return {};
    return {
      chart: {
        type: "area",
        height: 350,
        toolbar: { show: false },
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      xaxis: {
        categories: stats.timeSeries.map((item) =>
          new Date(item.date).toLocaleDateString("vi-VN", {
            month: "short",
            day: "numeric",
          })
        ),
      },
      yaxis: {
        title: { text: "Số lượng bookings" },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 90, 100],
        },
      },
      tooltip: {
        x: { format: "dd/MM/yyyy" },
      },
      colors: ["#3b82f6"],
    };
  }, [stats?.timeSeries]);

  const timeSeriesChartSeries = useMemo(() => {
    if (!stats?.timeSeries) return [];
    return [
      {
        name: "Bookings",
        data: stats.timeSeries.map((item) => item.count),
      },
    ];
  }, [stats?.timeSeries]);

  // Status Charts
  const tourStatusChartOptions: ApexOptions = useMemo(() => {
    if (!stats?.tourStatusStats) return {};
    return {
      chart: {
        type: "donut",
        height: 350,
      },
      labels: stats.tourStatusStats.map((s) => getStatusLabel(s.trang_thai)),
      legend: { position: "bottom" },
      colors: ["#10b981", "#f59e0b", "#ef4444"],
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val.toFixed(1)}%`,
      },
    };
  }, [stats?.tourStatusStats]);

  const tourStatusChartSeries = useMemo(() => {
    if (!stats?.tourStatusStats) return [];
    return stats.tourStatusStats.map((s) => s._count.id);
  }, [stats?.tourStatusStats]);

  const bookingStatusChartOptions: ApexOptions = useMemo(() => {
    if (!stats?.bookingStatusStats) return {};
    return {
      chart: {
        type: "donut",
        height: 350,
      },
      labels: stats.bookingStatusStats.map((s) => getStatusLabel(s.trang_thai)),
      legend: { position: "bottom" },
      colors: ["#f59e0b", "#3b82f6", "#ef4444", "#10b981"],
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val.toFixed(1)}%`,
      },
    };
  }, [stats?.bookingStatusStats]);

  const bookingStatusChartSeries = useMemo(() => {
    if (!stats?.bookingStatusStats) return [];
    return stats.bookingStatusStats.map((s) => s._count.id);
  }, [stats?.bookingStatusStats]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-200">
          Lỗi khi tải thống kê: {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Thống kê
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Phân tích dữ liệu và hiệu suất hệ thống
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Từ ngày:
            </label>
            <div className="relative">
              <input
                ref={fromDateRef}
                type="date"
                value={filters.from}
                onChange={(e) =>
                  setFilters({ ...filters, from: e.target.value })
                }
                onInput={(e) => {
                  // Allow manual input
                  const target = e.target as HTMLInputElement;
                  setFilters({ ...filters, from: target.value });
                }}
                max={filters.to || getTodayDate()}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-text"
                placeholder="DD/MM/YYYY hoặc click để chọn"
              />
              <button
                type="button"
                onClick={openFromDatePicker}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-primary transition-colors"
                title="Chọn ngày"
              >
                <Calendar className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Đến ngày:
            </label>
            <div className="relative">
              <input
                ref={toDateRef}
                type="date"
                value={filters.to}
                onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                onInput={(e) => {
                  // Allow manual input
                  const target = e.target as HTMLInputElement;
                  setFilters({ ...filters, to: target.value });
                }}
                min={filters.from}
                max={getTodayDate()}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-text"
                placeholder="DD/MM/YYYY hoặc click để chọn"
              />
              <button
                type="button"
                onClick={openToDatePicker}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-primary transition-colors"
                title="Chọn ngày"
              >
                <Calendar className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={resetToToday}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap h-[42px]"
            >
              <RotateCcw className="w-4 h-4" />
              Hiện ngày
            </button>
          </div>
        </div>
        {filters.from === filters.to && filters.from === getTodayDate() && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Đang hiển thị thống kê cho hôm nay ({new Date().toLocaleDateString("vi-VN")})
          </p>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tổng Tours</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats?.totalTours || 0}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tổng Bookings</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats?.totalBookings || 0}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tổng Users</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats?.totalUsers || 0}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stats?.totalRevenue ? formatPrice(stats.totalRevenue) : "0 ₫"}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Series Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Bookings theo thời gian
          </h2>
          {timeSeriesChartSeries.length > 0 && (
            <ReactApexChart
              options={timeSeriesChartOptions}
              series={timeSeriesChartSeries}
              type="area"
              height={350}
            />
          )}
        </div>

        {/* Tour Status Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Trạng thái Tours
          </h2>
          {tourStatusChartSeries.length > 0 && (
            <ReactApexChart
              options={tourStatusChartOptions}
              series={tourStatusChartSeries}
              type="donut"
              height={350}
            />
          )}
        </div>
      </div>

      {/* Booking Status Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Trạng thái Bookings
        </h2>
        {bookingStatusChartSeries.length > 0 && (
          <ReactApexChart
            options={bookingStatusChartOptions}
            series={bookingStatusChartSeries}
            type="donut"
            height={350}
          />
        )}
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
                    STT
                  </th>
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
                {stats.topTours.map((tour, index) => (
                  <tr
                    key={tour.tour_id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4">
                      <a
                        href={`/tours/${tour.tour_id}`}
                        target="_blank"
                        className="text-primary hover:underline font-medium"
                      >
                        {tour.ten_tour}
                      </a>
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
    </div>
  );
}
