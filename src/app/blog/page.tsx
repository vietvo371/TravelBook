"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import PublicNavbar from "@/components/layout/PublicNavbar";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  category: string;
}

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [page, setPage] = useState(1);
  const postsPerPage = 6;

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "10 Điểm Đến Du Lịch Đẹp Nhất Việt Nam 2025",
      excerpt: "Khám phá những địa điểm du lịch tuyệt vời nhất tại Việt Nam, từ phố cổ Hội An đến vịnh Hạ Long hùng vĩ...",
      image: "/images/cards/card-01.jpg",
      date: "15/11/2025",
      author: "TravelBook Team",
      category: "Du lịch trong nước",
    },
    {
      id: 2,
      title: "Bí Quyết Đặt Tour Du Lịch Tiết Kiệm",
      excerpt: "Những mẹo hay giúp bạn đặt tour du lịch với giá tốt nhất, tận dụng các chương trình khuyến mãi...",
      image: "/images/cards/card-02.jpg",
      date: "12/11/2025",
      author: "TravelBook Team",
      category: "Tips du lịch",
    },
    {
      id: 3,
      title: "Hành Trình Khám Phá Đà Lạt - Thành Phố Ngàn Hoa",
      excerpt: "Trải nghiệm Đà Lạt với khí hậu mát mẻ, cảnh đẹp thiên nhiên và văn hóa đặc sắc của vùng cao nguyên...",
      image: "/images/cards/card-03.jpg",
      date: "10/11/2025",
      author: "TravelBook Team",
      category: "Du lịch trong nước",
    },
    {
      id: 4,
      title: "Checklist Chuẩn Bị Cho Chuyến Du Lịch Dài Ngày",
      excerpt: "Danh sách đầy đủ những vật dụng cần thiết cho chuyến du lịch dài ngày, đảm bảo bạn không quên gì...",
      image: "/images/cards/card-01.jpg",
      date: "8/11/2025",
      author: "TravelBook Team",
      category: "Tips du lịch",
    },
    {
      id: 5,
      title: "Phú Quốc - Thiên Đường Biển Đảo Của Việt Nam",
      excerpt: "Khám phá hòn đảo ngọc Phú Quốc với những bãi biển tuyệt đẹp, resort sang trọng và ẩm thực hải sản tươi ngon...",
      image: "/images/cards/card-02.jpg",
      date: "5/11/2025",
      author: "TravelBook Team",
      category: "Du lịch trong nước",
    },
    {
      id: 6,
      title: "Những Lưu Ý Khi Đặt Tour Du Lịch Quốc Tế",
      excerpt: "Các điều cần biết khi đặt tour du lịch nước ngoài: visa, bảo hiểm, tiền tệ và các thủ tục cần thiết...",
      image: "/images/cards/card-03.jpg",
      date: "3/11/2025",
      author: "TravelBook Team",
      category: "Du lịch quốc tế",
    },
    {
      id: 7,
      title: "Sapa - Nơi Gặp Gỡ Giữa Trời Và Đất",
      excerpt: "Khám phá Sapa với những ruộng bậc thang tuyệt đẹp, văn hóa dân tộc đa dạng và khí hậu mát mẻ quanh năm...",
      image: "/images/cards/card-01.jpg",
      date: "1/11/2025",
      author: "TravelBook Team",
      category: "Du lịch trong nước",
    },
    {
      id: 8,
      title: "Cách Chọn Tour Du Lịch Phù Hợp Với Ngân Sách",
      excerpt: "Hướng dẫn chi tiết cách lựa chọn tour du lịch phù hợp với ngân sách của bạn mà vẫn đảm bảo chất lượng...",
      image: "/images/cards/card-02.jpg",
      date: "28/10/2025",
      author: "TravelBook Team",
      category: "Tips du lịch",
    },
    {
      id: 9,
      title: "Thái Lan - Điểm Đến Lý Tưởng Cho Du Lịch Quốc Tế",
      excerpt: "Khám phá đất nước Thái Lan với văn hóa đặc sắc, ẩm thực phong phú và những điểm đến nổi tiếng...",
      image: "/images/cards/card-03.jpg",
      date: "25/10/2025",
      author: "TravelBook Team",
      category: "Du lịch quốc tế",
    },
    {
      id: 10,
      title: "Hạ Long - Kỳ Quan Thiên Nhiên Thế Giới",
      excerpt: "Trải nghiệm vịnh Hạ Long với hàng nghìn đảo đá vôi kỳ vĩ, hang động bí ẩn và cảnh quan thiên nhiên tuyệt đẹp...",
      image: "/images/cards/card-01.jpg",
      date: "22/10/2025",
      author: "TravelBook Team",
      category: "Du lịch trong nước",
    },
    {
      id: 11,
      title: "Nhật Bản - Xứ Sở Hoa Anh Đào",
      excerpt: "Khám phá Nhật Bản với văn hóa truyền thống độc đáo, ẩm thực tinh tế và cảnh quan thiên nhiên tuyệt đẹp...",
      image: "/images/cards/card-02.jpg",
      date: "20/10/2025",
      author: "TravelBook Team",
      category: "Du lịch quốc tế",
    },
    {
      id: 12,
      title: "Mẹo Đóng Gói Hành Lý Thông Minh Cho Chuyến Du Lịch",
      excerpt: "Những bí quyết đóng gói hành lý hiệu quả, tiết kiệm không gian và đảm bảo bạn có đủ mọi thứ cần thiết...",
      image: "/images/cards/card-03.jpg",
      date: "18/10/2025",
      author: "TravelBook Team",
      category: "Tips du lịch",
    },
  ];

  const categories = ["Tất cả", "Du lịch trong nước", "Du lịch quốc tế", "Tips du lịch"];

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    let filtered = blogPosts;

    // Filter by category
    if (selectedCategory !== "Tất cả") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Filter by search
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [search, selectedCategory, blogPosts]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (page - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PublicNavbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Blog Du Lịch
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
              Chia sẻ kinh nghiệm, tips du lịch và những câu chuyện thú vị từ các chuyến đi
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-white border-primary"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-primary hover:text-white hover:border-primary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          {filteredPosts.length > 0 && (
            <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
              Tìm thấy {filteredPosts.length} bài viết
            </div>
          )}

          {/* Blog Posts Grid */}
          {paginatedPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {paginatedPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.id}`}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 text-xs font-semibold text-white bg-primary rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.author}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                      <span className="text-primary text-sm font-medium group-hover:underline">
                        Đọc thêm →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    Trang {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                Không tìm thấy bài viết nào
              </p>
            </div>
          )}
        </div>
      </div>

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
