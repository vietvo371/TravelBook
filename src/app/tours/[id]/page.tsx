"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { useAuthStore } from "@/store/authStore";
import { useAlert } from "@/hooks/useAlert";
import { AlertModal } from "@/components/ui/AlertModal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode, Zoom } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import "swiper/css/zoom";

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
  const { user, isAuthenticated } = useAuthStore();
  const { showSuccess, alertState, closeAlert } = useAlert();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
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

  // Auto-fill user data when logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setBookingData((prev) => ({
        ...prev,
        ho_ten: user.ho_ten || "",
        email: user.email || "",
        so_dien_thoai: user.so_dien_thoai || "",
        dia_chi: user.dia_chi || "",
      }));
    }
  }, [isAuthenticated, user]);

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
      showSuccess("Đặt tour thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.");
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
    
    // Check if user is logged in
    if (!isAuthenticated || !user) {
      router.push(`/login?redirect=/tours/${params.id}`);
      return;
    }

    bookingMutation.mutate(bookingData);
  };

  const handleBookingClick = () => {
    if (!isAuthenticated || !user) {
      router.push(`/login?redirect=/tours/${params.id}`);
      return;
    }
    setShowBookingForm(!showBookingForm);
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

    // Prepare images array
  const allImages = [];
  if (tour.hinh_anh_chinh) {
    allImages.push({ id: 0, url: tour.hinh_anh_chinh, alt_text: tour.ten_tour });
  }
  if (tour.images && tour.images.length > 0) {
    tour.images.forEach((img) => {
      if (img.url !== tour.hinh_anh_chinh) {
        allImages.push(img);
      }
    });
  }
  if (allImages.length === 0) {
    allImages.push({ id: 0, url: "/images/cards/card-01.jpg", alt_text: tour.ten_tour });
  }

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
            {/* Image Gallery */}
            <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              {/* Main Image Swiper */}
              <div className="relative mb-4">
                <Swiper
                  onSwiper={setMainSwiper}
                  modules={[Navigation, Thumbs, Zoom]}
                  navigation={allImages.length > 1}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  zoom={{
                    maxRatio: 3,
                    minRatio: 1,
                  }}
                  className="main-swiper rounded-lg overflow-hidden"
                  onSlideChange={(swiper) => {
                    setSelectedImageIndex(swiper.activeIndex);
                    if (thumbsSwiper && !thumbsSwiper.destroyed) {
                      thumbsSwiper.slideTo(swiper.activeIndex);
                    }
                  }}
                >
                  {allImages.map((img, index) => (
                    <SwiperSlide key={img.id || index} className="relative">
                      <div className="swiper-zoom-container">
                        <div className="relative h-[500px] w-full cursor-zoom-in" onClick={() => setShowLightbox(true)}>
                          <Image
                            src={img.url}
                            alt={img.alt_text || tour.ten_tour}
                            fill
                            className="object-cover"
                            priority={index === 0}
                          />
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                
                {/* Image Counter */}
                {allImages.length > 1 && (
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
                    {selectedImageIndex + 1} / {allImages.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Swiper */}
              {allImages.length > 1 && (
                <Swiper
                  onSwiper={setThumbsSwiper}
                  modules={[FreeMode, Navigation, Thumbs]}
                  spaceBetween={10}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  className="thumbnail-swiper"
                  breakpoints={{
                    640: {
                      slidesPerView: 4,
                    },
                    768: {
                      slidesPerView: 5,
                    },
                    1024: {
                      slidesPerView: 6,
                    },
                  }}
                >
                  {allImages.map((img, index) => (
                    <SwiperSlide
                      key={img.id || index}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? "border-primary scale-105"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                      onClick={() => {
                        setSelectedImageIndex(index);
                        if (mainSwiper && !mainSwiper.destroyed) {
                          mainSwiper.slideTo(index);
                        }
                      }}
                    >
                      <div className="relative h-20 w-full">
                        <Image
                          src={img.url}
                          alt={img.alt_text || tour.ten_tour}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>

            {/* Lightbox Modal */}
            {showLightbox && (
              <div
                className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                onClick={() => setShowLightbox(false)}
              >
                <button
                  onClick={() => setShowLightbox(false)}
                  className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                >
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="relative max-w-7xl w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                  <Swiper
                    modules={[Navigation, Zoom]}
                    navigation
                    zoom={{
                      maxRatio: 3,
                      minRatio: 1,
                    }}
                    initialSlide={selectedImageIndex}
                    className="w-full h-full"
                  >
                    {allImages.map((img, index) => (
                      <SwiperSlide key={img.id || index} className="flex items-center justify-center">
                        <div className="swiper-zoom-container">
                          <Image
                            src={img.url}
                            alt={img.alt_text || tour.ten_tour}
                            width={1200}
                            height={800}
                            className="object-contain max-h-[90vh]"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            )}

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
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <div className="text-3xl font-bold text-primary">
                    {formatPrice(tour.gia_nguoi_lon)}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    / người lớn
                  </span>
                </div>
                {tour.gia_tre_em && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Trẻ em: {formatPrice(tour.gia_tre_em)}
                  </p>
                )}
              </div>

              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Số chỗ còn lại
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {tour.so_cho_trong}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${(tour.so_cho_trong / tour.so_cho_toi_da) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {tour.so_cho_trong} / {tour.so_cho_toi_da} chỗ
                </p>
              </div>

              {tour.so_cho_trong > 0 ? (
                <>
                  {!isAuthenticated ? (
                    <div className="space-y-3">
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                              Vui lòng đăng nhập
                            </p>
                            <p className="text-xs text-yellow-700 dark:text-yellow-300">
                              Bạn cần đăng nhập để đặt tour
                            </p>
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`/login?redirect=/tours/${params.id}`}
                        className="block w-full px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors text-center shadow-lg hover:shadow-xl"
                      >
                        Đăng nhập để đặt tour
                      </Link>
                      <Link
                        href="/register"
                        className="block w-full px-4 py-2 text-center text-sm text-primary hover:underline"
                      >
                        Chưa có tài khoản? Đăng ký ngay
                      </Link>
                    </div>
                  ) : (
                    <>
                      {!showBookingForm ? (
                        <button
                          onClick={handleBookingClick}
                          className="w-full px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
                        >
                          Đặt tour ngay
                        </button>
                      ) : (
                        <button
                          onClick={handleBookingClick}
                          className="w-full px-4 py-2 mb-4 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                        >
                          ← Quay lại
                        </button>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div className="space-y-3">
                  <button
                    disabled
                    className="w-full px-4 py-3 bg-gray-400 text-white rounded-lg font-semibold cursor-not-allowed"
                  >
                    Hết chỗ
                  </button>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    Tour này đã hết chỗ. Vui lòng chọn tour khác.
                  </p>
                </div>
              )}

              {showBookingForm && isAuthenticated && (
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
    </div>
  );
}

