"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, X, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const { success, error, warning } = useToast();
  const blogId = parseInt(params.id as string);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["blog", blogId],
    queryFn: async () => {
      const res = await fetch(`/api/blogs/${blogId}`);
      if (!res.ok) throw new Error("Failed to fetch blog");
      return res.json();
    },
  });

  const [formData, setFormData] = useState({
    tieu_de: "",
    slug: "",
    mo_ta_ngan: "",
    noi_dung: "",
    hinh_anh: "",
    danh_muc: "",
    tags: [] as string[],
    trang_thai: "draft",
    ngay_dang: "",
  });

  const [tagInput, setTagInput] = useState("");

  // Load blog data when fetched
  useEffect(() => {
    if (data?.blog) {
      const blog = data.blog;
      setFormData({
        tieu_de: blog.tieu_de || "",
        slug: blog.slug || "",
        mo_ta_ngan: blog.mo_ta_ngan || "",
        noi_dung: blog.noi_dung || "",
        hinh_anh: blog.hinh_anh || "",
        danh_muc: blog.danh_muc || "",
        tags: blog.tags || [],
        trang_thai: blog.trang_thai || "draft",
        ngay_dang: blog.ngay_dang
          ? new Date(blog.ngay_dang).toISOString().slice(0, 16)
          : "",
      });
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/blogs/${blogId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update blog");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog", blogId] });
      success("Cập nhật blog thành công!");
      router.push("/admin/blogs");
    },
    onError: (err: any) => {
      error(err.message || "Có lỗi xảy ra khi cập nhật blog");
      setIsSubmitting(false);
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({ ...formData, tieu_de: title });
    
    // Generate slug from title if slug is empty or matches old title
    if (!formData.slug || formData.slug === data?.blog?.slug) {
      const slug = title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.tieu_de || !formData.slug || !formData.noi_dung) {
      warning("Vui lòng điền đầy đủ thông tin bắt buộc");
      setIsSubmitting(false);
      return;
    }

    const submitData = {
      ...formData,
      ngay_dang: formData.trang_thai === "published" && !formData.ngay_dang
        ? new Date().toISOString()
        : formData.ngay_dang || null,
    };

    updateMutation.mutate(submitData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data?.blog) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Không tìm thấy blog</p>
        <Link
          href="/admin/blogs"
          className="mt-4 text-primary hover:underline"
        >
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Chỉnh sửa blog
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Cập nhật thông tin bài viết blog
          </p>
        </div>
        <Link
          href="/admin/blogs"
          className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Thông tin cơ bản
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.tieu_de}
              onChange={handleTitleChange}
              placeholder="Nhập tiêu đề blog..."
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Slug (URL) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="url-friendly-slug"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Slug sẽ được tự động tạo từ tiêu đề, bạn có thể chỉnh sửa
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mô tả ngắn
            </label>
            <textarea
              value={formData.mo_ta_ngan}
              onChange={(e) => setFormData({ ...formData, mo_ta_ngan: e.target.value })}
              rows={3}
              placeholder="Mô tả ngắn gọn về bài viết..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nội dung <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.noi_dung}
              onChange={(e) => setFormData({ ...formData, noi_dung: e.target.value })}
              rows={15}
              placeholder="Nhập nội dung bài viết..."
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono text-sm"
            />
          </div>
        </div>

        {/* Media & Metadata */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Hình ảnh & Metadata
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hình ảnh đại diện (URL)
            </label>
            <input
              type="url"
              value={formData.hinh_anh}
              onChange={(e) => setFormData({ ...formData, hinh_anh: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Danh mục
            </label>
            <input
              type="text"
              value={formData.danh_muc}
              onChange={(e) => setFormData({ ...formData, danh_muc: e.target.value })}
              placeholder="Ví dụ: Du lịch trong nước, Tips du lịch..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Nhập tag và nhấn Enter..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status & Publish */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Trạng thái & Đăng bài
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Trạng thái
            </label>
            <select
              value={formData.trang_thai}
              onChange={(e) => setFormData({ ...formData, trang_thai: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="draft">Bản nháp</option>
              <option value="published">Đã đăng</option>
              <option value="archived">Đã lưu trữ</option>
            </select>
          </div>

          {formData.trang_thai === "published" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ngày đăng (để trống sẽ dùng ngày hiện tại)
              </label>
              <input
                type="datetime-local"
                value={formData.ngay_dang}
                onChange={(e) => setFormData({ ...formData, ngay_dang: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/admin/blogs"
            className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || updateMutation.isPending}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting || updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Cập nhật blog
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

