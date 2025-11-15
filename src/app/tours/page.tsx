"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import PublicNavbar from "@/components/layout/PublicNavbar";

interface Tour {
  id: number;
  ten_tour: string;
  mo_ta_ngan: string | null;
  gia_nguoi_lon: number;
  gia_tre_em: number | null;
  so_ngay: number;
  so_dem: number;
  diem_den: string;
  hinh_anh_chinh: string | null;
  images: Array<{ url: string; alt_text: string | null }>;
  trang_thai: string;
  so_cho_trong: number;
}

export default function ToursPage() {
  const [search, setSearch] = useState("");
  const [diemDen, setDiemDen] = useState("");
  const [diemDenCustom, setDiemDenCustom] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [soNgay, setSoNgay] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Danh sách điểm đến phổ biến
  const popularDestinations = [
    "Đà Lạt",
    "Phú Quốc",
    "Sapa",
    "Hạ Long",
    "Hội An",
    "Nha Trang",
    "Đà Nẵng",
    "Huế",
    "Mũi Né",
    "Cần Thơ",
    "Hà Nội",
    "TP. Hồ Chí Minh",
  ];

  // Sử dụng diemDenCustom nếu chọn "other", ngược lại dùng diemDen
  const actualDiemDen = diemDen === "other" ? diemDenCustom : diemDen;

  const { data, isLoading, error } = useQuery({
    queryKey: ["tours", page, search, actualDiemDen, minPrice, maxPrice, soNgay, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        trang_thai: "dang_ban",
      });
      if (search) params.append("search", search);
      if (actualDiemDen) params.append("diem_den", actualDiemDen);
      if (minPrice) params.append("min_price", minPrice);
      if (maxPrice) params.append("max_price", maxPrice);
      if (soNgay) params.append("so_ngay", soNgay);
      if (sortBy) params.append("sort_by", sortBy);

      const res = await fetch(`/api/tours?${params}`);
      if (!res.ok) throw new Error("Failed to fetch tours");
      return res.json();
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getImageUrl = (tour: Tour) => {
    if (tour.hinh_anh_chinh) return tour.hinh_anh_chinh;
    if (tour.images && tour.images.length > 0) return tour.images[0].url;
    return "/images/cards/card-01.jpg";
  };

  const handleFilterChange = () => {
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setDiemDen("");
    setDiemDenCustom("");
    setMinPrice("");
    setMaxPrice("");
    setSoNgay("");
    setSortBy("newest");
    setPage(1);
  };

  const hasActiveFilters = search || actualDiemDen || minPrice || maxPrice || soNgay || sortBy !== "newest";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PublicNavbar />
      <div className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Danh sách Tour Du Lịch
            </h1>
            
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm tour..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    handleFilterChange();
                  }}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Bộ lọc
                {hasActiveFilters && (
                  <span className="px-2 py-0.5 text-xs bg-primary text-white rounded-full">
                    {[search, actualDiemDen, minPrice, maxPrice, soNgay].filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bộ lọc</h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-primary hover:underline"
                    >
                      Xóa tất cả
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Vị trí / Điểm đến
                    </label>
                    <div className="space-y-2">
                      <select
                        value={diemDen}
                        onChange={(e) => {
                          setDiemDen(e.target.value);
                          handleFilterChange();
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="">Tất cả điểm đến</option>
                        {popularDestinations.map((dest) => (
                          <option key={dest} value={dest}>
                            {dest}
                          </option>
                        ))}
                        <option value="other">Khác (tìm kiếm tự do)</option>
                      </select>
                      {diemDen === "other" && (
                        <input
                          type="text"
                          placeholder="Nhập điểm đến..."
                          value={diemDenCustom}
                          onChange={(e) => {
                            setDiemDenCustom(e.target.value);
                            handleFilterChange();
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          autoFocus
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Giá tối thiểu (VNĐ)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => {
                        setMinPrice(e.target.value);
                        handleFilterChange();
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Giá tối đa (VNĐ)
                    </label>
                    <input
                      type="number"
                      placeholder="Không giới hạn"
                      value={maxPrice}
                      onChange={(e) => {
                        setMaxPrice(e.target.value);
                        handleFilterChange();
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Số ngày
                    </label>
                    <select
                      value={soNgay}
                      onChange={(e) => {
                        setSoNgay(e.target.value);
                        handleFilterChange();
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">Tất cả</option>
                      <option value="1">1 ngày</option>
                      <option value="2">2 ngày</option>
                      <option value="3">3 ngày</option>
                      <option value="4">4 ngày</option>
                      <option value="5">5 ngày</option>
                      <option value="6">6+ ngày</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sắp xếp theo
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      handleFilterChange();
                    }}
                    className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="oldest">Cũ nhất</option>
                    <option value="price_asc">Giá: Thấp → Cao</option>
                    <option value="price_desc">Giá: Cao → Thấp</option>
                    <option value="days_asc">Số ngày: Ít → Nhiều</option>
                    <option value="days_desc">Số ngày: Nhiều → Ít</option>
                  </select>
                </div>
              </div>
            )}

            {/* Results Count */}
            {data && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Tìm thấy {data.pagination.total} tour
              </div>
            )}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">Có lỗi xảy ra khi tải danh sách tour</p>
            </div>
          )}

          {/* Tours Grid */}
          {data && (
            <>
              {data.tours.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {data.tours.map((tour: Tour) => (
                      <Link
                        key={tour.id}
                        href={`/tours/${tour.id}`}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
                      >
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={getImageUrl(tour)}
                            alt={tour.ten_tour}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          {tour.so_cho_trong === 0 && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                              Hết chỗ
                            </div>
                          )}
                          {tour.so_cho_trong > 0 && tour.so_cho_trong <= 5 && (
                            <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-sm font-semibold">
                              Sắp hết
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {tour.ten_tour}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                            {tour.mo_ta_ngan || "Không có mô tả"}
                          </p>
                          <div className="flex items-center justify-between mb-3 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {tour.diem_den}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {tour.so_ngay}N/{tour.so_dem}Đ
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                            <span className="text-2xl font-bold text-primary">
                              {formatPrice(tour.gia_nguoi_lon)}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Còn {tour.so_cho_trong} chỗ
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {data.pagination && (
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Hiển thị <span className="font-semibold">{((page - 1) * data.pagination.limit) + 1}</span> - <span className="font-semibold">{Math.min(page * data.pagination.limit, data.pagination.total)}</span> của <span className="font-semibold">{data.pagination.total}</span> tour
                        </div>
                        
                        {data.pagination.totalPages > 1 && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setPage((p) => Math.max(1, p - 1))}
                              disabled={page === 1}
                              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 transition-colors"
                            >
                              ← Trước
                            </button>
                            
                            {/* Page Numbers */}
                            <div className="flex gap-1">
                              {/* First page */}
                              {page > 3 && data.pagination.totalPages > 5 && (
                                <>
                                  <button
                                    onClick={() => setPage(1)}
                                    className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 transition-colors"
                                  >
                                    1
                                  </button>
                                  {page > 4 && (
                                    <span className="px-2 py-2 text-gray-500">...</span>
                                  )}
                                </>
                              )}

                              {/* Page numbers around current page */}
                              {Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
                                let pageNum;
                                if (data.pagination.totalPages <= 5) {
                                  pageNum = i + 1;
                                } else if (page <= 3) {
                                  pageNum = i + 1;
                                } else if (page >= data.pagination.totalPages - 2) {
                                  pageNum = data.pagination.totalPages - 4 + i;
                                } else {
                                  pageNum = page - 2 + i;
                                }
                                
                                return (
                                  <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${
                                      page === pageNum
                                        ? "bg-primary text-white border-primary shadow-md"
                                        : "border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
                                    }`}
                                  >
                                    {pageNum}
                                  </button>
                                );
                              })}

                              {/* Last page */}
                              {page < data.pagination.totalPages - 2 && data.pagination.totalPages > 5 && (
                                <>
                                  {page < data.pagination.totalPages - 3 && (
                                    <span className="px-2 py-2 text-gray-500">...</span>
                                  )}
                                  <button
                                    onClick={() => setPage(data.pagination.totalPages)}
                                    className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 transition-colors"
                                  >
                                    {data.pagination.totalPages}
                                  </button>
                                </>
                              )}
                            </div>

                            <button
                              onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                              disabled={page === data.pagination.totalPages}
                              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 transition-colors"
                            >
                              Sau →
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Không tìm thấy tour nào
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Xóa bộ lọc
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
