"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { useToast } from "@/context/ToastContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ho_ten: "",
    so_dien_thoai: "",
    dia_chi: "",
    email: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    setFormData({
      ho_ten: user.ho_ten || "",
      so_dien_thoai: user.so_dien_thoai || "",
      dia_chi: user.dia_chi || "",
      email: user.email || "",
    });
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/users/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ho_ten: formData.ho_ten,
          so_dien_thoai: formData.so_dien_thoai,
          dia_chi: formData.dia_chi,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Cập nhật thất bại");
      }

      // Update user in store
      if (user) {
        setUser({
          ...user,
          ho_ten: formData.ho_ten,
          so_dien_thoai: formData.so_dien_thoai,
          dia_chi: formData.dia_chi,
        });
      }

      success("Cập nhật thông tin thành công!");
    } catch (err: any) {
      showError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PublicNavbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Hồ sơ cá nhân
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Họ tên *
                </label>
                <input
                  type="text"
                  required
                  value={formData.ho_ten}
                  onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Email không thể thay đổi
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.so_dien_thoai}
                  onChange={(e) => setFormData({ ...formData, so_dien_thoai: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Địa chỉ
                </label>
                <textarea
                  value={formData.dia_chi}
                  onChange={(e) => setFormData({ ...formData, dia_chi: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

