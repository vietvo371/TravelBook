"use client";

import { useState } from "react";
import Link from "next/link";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { EnvelopeIcon } from "@/icons";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    ho_ten: "",
    email: "",
    so_dien_thoai: "",
    tieu_de: "",
    noi_dung: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Implement contact form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        ho_ten: "",
        email: "",
        so_dien_thoai: "",
        tieu_de: "",
        noi_dung: "",
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PublicNavbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Liên hệ với chúng tôi
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy gửi tin nhắn cho chúng tôi!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <EnvelopeIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Gửi email cho chúng tôi</p>
                  </div>
                </div>
                <a
                  href="mailto:info@travelbook.com"
                  className="text-primary hover:underline"
                >
                  info@travelbook.com
                </a>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Điện thoại</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Gọi cho chúng tôi</p>
                  </div>
                </div>
                <a
                  href="tel:19001234"
                  className="text-primary hover:underline"
                >
                  1900 1234
                </a>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Địa chỉ</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Đến thăm chúng tôi</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  123 Đường ABC, Quận 1<br />
                  TP. Hồ Chí Minh, Việt Nam
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Giờ làm việc
                </h3>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>Thứ 2 - Thứ 6:</span>
                    <span className="font-medium">8:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thứ 7:</span>
                    <span className="font-medium">8:00 - 12:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chủ nhật:</span>
                    <span className="font-medium">Nghỉ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Gửi tin nhắn
                </h2>

                {submitted ? (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-6">
                    <p className="text-green-800 dark:text-green-200">
                      ✅ Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Họ tên *
                        </label>
                        <input
                          type="text"
                          name="ho_ten"
                          value={formData.ho_ten}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Nhập họ tên của bạn"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        name="so_dien_thoai"
                        value={formData.so_dien_thoai}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="0123456789"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tiêu đề *
                      </label>
                      <input
                        type="text"
                        name="tieu_de"
                        value={formData.tieu_de}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Tiêu đề tin nhắn"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nội dung *
                      </label>
                      <textarea
                        name="noi_dung"
                        value={formData.noi_dung}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                        placeholder="Nhập nội dung tin nhắn của bạn..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Đang gửi..." : "Gửi tin nhắn"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
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
