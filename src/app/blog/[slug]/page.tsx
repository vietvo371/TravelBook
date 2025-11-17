"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { Loader2, ArrowLeft, Calendar, User, Eye, Tag } from "lucide-react";

interface BlogDetail {
  id: number;
  tieu_de: string;
  slug: string;
  mo_ta_ngan: string | null;
  noi_dung: string;
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

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const res = await fetch(`/api/blogs/slug/${slug}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Không tìm thấy bài viết");
        }
        throw new Error("Failed to fetch blog");
      }
      return res.json();
    },
  });

  const blog: BlogDetail | null = data?.blog;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <PublicNavbar />
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <PublicNavbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Không tìm thấy bài viết
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error instanceof Error ? error.message : "Bài viết không tồn tại hoặc đã bị xóa"}
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại danh sách blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PublicNavbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách blog
          </Link>

          {/* Article Header */}
          <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* Featured Image */}
            {blog.hinh_anh && (
              <div className="relative w-full h-96 overflow-hidden">
                <Image
                  src={blog.hinh_anh}
                  alt={blog.tieu_de}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="p-8">
              {/* Category */}
              {blog.danh_muc && (
                <div className="mb-4">
                  <span className="inline-block px-4 py-1 text-sm font-semibold text-white bg-primary rounded-full">
                    {blog.danh_muc}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {blog.tieu_de}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                {blog.ngay_dang && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(blog.ngay_dang)}</span>
                  </div>
                )}
                {blog.tac_gia && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{blog.tac_gia.ho_ten}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{blog.luot_xem} lượt xem</span>
                </div>
              </div>

              {/* Short Description */}
              {blog.mo_ta_ngan && (
                <div className="mb-8">
                  <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                    {blog.mo_ta_ngan}
                  </p>
                </div>
              )}

              {/* Content */}
              <div
                className="blog-content mb-8 text-gray-700 dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blog.noi_dung }}
                style={{
                  lineHeight: "1.8",
                }}
              />

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>

          {/* Related Posts / Navigation */}
          <div className="mt-8 flex justify-between items-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              Xem tất cả bài viết
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative py-12 bg-gray-900 dark:bg-gray-950 mt-16">
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

