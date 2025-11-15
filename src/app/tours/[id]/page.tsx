"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PublicNavbar from "@/components/layout/PublicNavbar";

interface Tour {
  id: number;
  ten_tour: string;
  mo_ta: string | null;
  mo_ta_ngan: string | null;
  gia_nguoi_lon: number;
  gia_tre_em: number | null;
  so_ngay: number;
  so_dem: number;
  diem_khoi_hanh: string;
  diem_den: string;
  phuong_tien: string;
  khach_san: string | null;
  lich_trinh: any;
  bao_gom: string[];
  khong_bao_gom: string[];
  dieu_kien: string | null;
  so_cho_trong: number;
  so_cho_toi_da: number;
  hinh_anh_chinh: string | null;
  images: Array<{ id: number; url: string; alt_text: string | null }>;
}

export default function TourDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    ho_ten: "",
    email: "",
    so_dien_thoai: "",
    dia_chi: "",
    so_nguoi_lon: 1,
    so_tre_em: 0,
    ngay_khoi_hanh: "",
    ghi_chu: "",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["tour", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/tours/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch tour");
      return res.json();
    },
  });

  const queryClient = useQueryClient();

  const bookingMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tour_id: params.id,
          ...data,
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create booking");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tour", params.id] });
      alert("Đặt tour thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.");
      setShowBookingForm(false);
      setBookingData({
        ho_ten: "",
        email: "",
        so_dien_thoai: "",
        dia_chi: "",
        so_nguoi_lon: 1,
        so_tre_em: 0,
        ngay_khoi_hanh: "",
        ghi_chu: "",
      });
    },
  });

  const tour: Tour | undefined = data?.tour;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const calculateTotal = () => {
    if (!tour) return 0;
    return (
      bookingData.so_nguoi_lon * tour.gia_nguoi_lon +
      bookingData.so_tre_em * (tour.gia_tre_em || tour.gia_nguoi_lon * 0.7)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookingMutation.mutate(bookingData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <PublicNavbar />
        <div className="pt-24 pb-8">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <PublicNavbar />
        <div className="pt-24 pb-8">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">Không tìm thấy tour</p>
              <Link
                href="/tours"
                className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Quay lại danh sách
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const mainImage = tour.hinh_anh_chinh || (tour.images && tour.images[0]?.url) || "/images/cards/card-01.jpg";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PublicNavbar />
      <div className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          <Link
            href="/tours"
            className="text-primary mb-6 inline-block hover:underline font-medium"
          >
            ← Quay lại danh sách tour
          </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="mb-6">
              <div className="relative h-96 w-full rounded-lg overflow-hidden mb-4">
                <Image
                  src={mainImage}
                  alt={tour.ten_tour}
                  fill
                  className="object-cover"
                />
              </div>
              {tour.images && tour.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {tour.images.slice(0, 4).map((img) => (
                    <div
                      key={img.id}
                      className="relative h-24 w-full rounded overflow-hidden"
                    >
                      <Image
                        src={img.url}
                        alt={img.alt_text || tour.ten_tour}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tour Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {tour.ten_tour}
              </h1>
              
              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Điểm khởi hành</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{tour.diem_khoi_hanh}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Điểm đến</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{tour.diem_den}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Thời gian</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {tour.so_ngay} ngày / {tour.so_dem} đêm
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phương tiện</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{tour.phuong_tien}</p>
                </div>
              </div>

              {tour.mo_ta && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Mô tả tour
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {tour.mo_ta}
                  </p>
                </div>
              )}

              {tour.lich_trinh && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Lịch trình
                  </h2>
                  <div className="text-gray-700 dark:text-gray-300">
                    {Array.isArray(tour.lich_trinh) ? (
                      <ul className="list-disc list-inside space-y-2">
                        {tour.lich_trinh.map((item: any, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <pre className="whitespace-pre-wrap">{JSON.stringify(tour.lich_trinh, null, 2)}</pre>
                    )}
                  </div>
                </div>
              )}

              {tour.bao_gom && tour.bao_gom.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Dịch vụ bao gồm
                  </h2>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    {tour.bao_gom.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {tour.khong_bao_gom && tour.khong_bao_gom.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Dịch vụ không bao gồm
                  </h2>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    {tour.khong_bao_gom.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {tour.dieu_kien && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Điều kiện hủy/đổi
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {tour.dieu_kien}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-8">
              <div className="mb-4">
                <div className="text-3xl font-bold text-primary mb-2">
                  {formatPrice(tour.gia_nguoi_lon)}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  / người lớn
                </p>
                {tour.gia_tre_em && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Trẻ em: {formatPrice(tour.gia_tre_em)}
                  </p>
                )}
              </div>

              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Còn {tour.so_cho_trong} / {tour.so_cho_toi_da} chỗ trống
                </p>
              </div>

              {tour.so_cho_trong > 0 ? (
                <button
                  onClick={() => setShowBookingForm(!showBookingForm)}
                  className="w-full px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  {showBookingForm ? "Ẩn form đặt tour" : "Đặt tour ngay"}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full px-4 py-3 bg-gray-400 text-white rounded-lg font-semibold cursor-not-allowed"
                >
                  Hết chỗ
                </button>
              )}

              {showBookingForm && (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Họ tên *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingData.ho_ten}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, ho_ten: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={bookingData.email}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, email: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      required
                      value={bookingData.so_dien_thoai}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, so_dien_thoai: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      value={bookingData.dia_chi}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, dia_chi: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Người lớn *
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={bookingData.so_nguoi_lon}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            so_nguoi_lon: parseInt(e.target.value) || 1,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Trẻ em
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={bookingData.so_tre_em}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            so_tre_em: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ngày khởi hành *
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingData.ngay_khoi_hanh}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, ngay_khoi_hanh: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ghi chú
                    </label>
                    <textarea
                      value={bookingData.ghi_chu}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, ghi_chu: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div className="p-3 bg-primary/10 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Tổng tiền:
                      </span>
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(calculateTotal())}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingMutation.isPending}
                    className="w-full px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {bookingMutation.isPending ? "Đang xử lý..." : "Xác nhận đặt tour"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

