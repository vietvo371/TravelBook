"use client"; 
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { 
  CheckCircleIcon,
  ChevronDownIcon,
} from "@/icons";

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

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fetch featured tours
  const { data: toursData, isLoading: toursLoading } = useQuery({
    queryKey: ["featured-tours"],
    queryFn: async () => {
      const res = await fetch("/api/tours?page=1&limit=6&trang_thai=dang_ban");
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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden sm:pt-40 sm:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-blue-light-50/20 dark:from-gray-950 dark:via-primary/5 dark:to-blue-light-950/10" />
        
        <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 font-bold text-gray-900 text-4xl sm:text-5xl lg:text-6xl dark:text-white"
            >
              Khám phá thế giới,{" "}
              <span className="bg-gradient-to-r from-primary via-primary/90 to-blue-light-500 bg-clip-text text-transparent">
                đặt tour dễ dàng
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-3xl mx-auto mb-10 text-lg text-gray-600 sm:text-xl dark:text-gray-400"
            >
              TravelBook là website đặt tour du lịch đơn giản, giúp bạn dễ dàng 
              xem danh sách tour, tìm hiểu chi tiết và đặt tour một cách nhanh chóng.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                href="/tours"
                className="inline-flex items-center justify-center px-6 py-4 text-base font-medium text-white transition-all rounded-xl shadow-lg bg-primary hover:bg-primary/90 hover:shadow-xl"
              >
                Xem tất cả Tours
              </Link>
              <Link
                href="#tours"
                className="inline-flex items-center justify-center px-6 py-4 text-base font-medium text-gray-700 transition-all bg-white border border-gray-300 rounded-xl hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                Khám phá ngay
                <ChevronDownIcon className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section id="tours" className="py-16 bg-gray-50 dark:bg-gray-800 sm:py-24">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
              Tours Nổi Bật
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
              Khám phá những tour du lịch được yêu thích nhất
            </p>
          </div>

          {toursLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải tours...</p>
            </div>
          ) : toursData && toursData.tours && toursData.tours.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {toursData.tours.map((tour: Tour) => (
                  <Link
                    key={tour.id}
                    href={`/tours/${tour.id}`}
                    className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
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
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                        {tour.ten_tour}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {tour.mo_ta_ngan || "Không có mô tả"}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>{tour.diem_den}</span>
                          <span>•</span>
                          <span>{tour.so_ngay}N/{tour.so_dem}Đ</span>
                        </div>
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
              
              <div className="text-center">
                <Link
                  href="/tours"
                  className="inline-flex items-center px-6 py-3 text-base font-medium text-white transition-all rounded-lg bg-primary hover:bg-primary/90"
                >
                  Xem tất cả Tours
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                Chưa có tour nào. Vui lòng quay lại sau.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white dark:bg-gray-900 sm:py-24">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
              Tại sao chọn TravelBook?
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: CheckCircleIcon,
                title: "Đặt tour dễ dàng",
                desc: "Chỉ với vài bước đơn giản, bạn có thể đặt tour ngay trên website mà không cần đăng nhập.",
              },
              {
                icon: () => (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Cập nhật thời gian thực",
                desc: "Số chỗ trống và trạng thái tour được cập nhật ngay lập tức, đảm bảo thông tin chính xác.",
              },
              {
                icon: () => (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: "Nhiều điểm đến",
                desc: "Khám phá hàng trăm tour du lịch đến các điểm đến trong nước và quốc tế với giá cả hợp lý.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 dark:bg-primary/20">
                  <feature.icon className="w-8 h-8 text-primary dark:text-primary/80" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 bg-gray-900 dark:bg-gray-950">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <Link href="/" className="text-2xl font-bold text-primary mb-4 inline-block">
                TravelBook
              </Link>
              <p className="mb-4 text-gray-300">
                Website đặt tour du lịch đơn giản, giúp bạn dễ dàng tìm và đặt tour phù hợp.
              </p>
              <p className="text-sm text-gray-400">
                © 2025 TravelBook. All rights reserved.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">
                Liên kết
              </h3>
              <ul className="space-y-2">
                {[
                  { name: "Tour", href: "/tours" },
                  { name: "Blog", href: "/blog" },
                  { name: "Liên hệ", href: "/lien-he" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-300 transition-colors hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">
                Hỗ trợ
              </h3>
              <ul className="space-y-2">
                {[
                  { name: "Về chúng tôi", href: "#" },
                  { name: "Câu hỏi thường gặp", href: "#" },
                  { name: "Chính sách", href: "#" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-300 transition-colors hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
