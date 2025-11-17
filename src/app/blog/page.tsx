"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { Loader2 } from "lucide-react";

interface BlogPost {
  id: number;
  tieu_de: string;
  slug: string;
  mo_ta_ngan: string | null;
  hinh_anh: string | null;
  danh_muc: string | null;
  tags: string[];
  luot_xem: number;
  ngay_dang: string | null;
  created_at: string;
  tac_gia: {
    id: number;
    ho_ten: string;
    email: string;
  } | null;
}

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [page, setPage] = useState(1);
  const postsPerPage = 6;

  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs", page, search, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: postsPerPage.toString(),
        trang_thai: "published",
      });
      if (search) params.append("search", search);
      if (selectedCategory !== "Tất cả") params.append("danh_muc", selectedCategory);

      const res = await fetch(`/api/blogs?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch blogs");
      return res.json();
    },
  });

  // Extract unique categories from blogs
  const categories = ["Tất cả"];
  if (data?.blogs) {
    const uniqueCategories = Array.from(
      new Set(data.blogs.map((blog: BlogPost) => blog.danh_muc).filter(Boolean))
    );
    categories.push(...(uniqueCategories as string[]));
  }

  // Reset to page 1 when filter changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const blogPosts = data?.blogs || [];
  const pagination = data?.pagination || { total: 0, totalPages: 0 };

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
          {!isLoading && pagination.total > 0 && (
            <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
              Tìm thấy {pagination.total} bài viết
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400">
                Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
              </p>
            </div>
          )}

          {/* Blog Posts Grid */}
          {!isLoading && !error && blogPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {blogPosts.map((post: BlogPost) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={post.hinh_anh || "/images/cards/card-01.jpg"}
                        alt={post.tieu_de}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {post.danh_muc && (
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 text-xs font-semibold text-white bg-primary rounded-full">
                            {post.danh_muc}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                        <span>{formatDate(post.ngay_dang)}</span>
                        {post.tac_gia && (
                          <>
                            <span>•</span>
                            <span>{post.tac_gia.ho_ten}</span>
                          </>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.tieu_de}
                      </h3>
                      {post.mo_ta_ngan && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                          {post.mo_ta_ngan}
                        </p>
                      )}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <span className="text-primary text-sm font-medium group-hover:underline">
                        Đọc thêm →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    Trang {page} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          ) : !isLoading && !error && blogPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                Không tìm thấy bài viết nào
              </p>
            </div>
          ) : null}
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
