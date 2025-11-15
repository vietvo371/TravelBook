"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", { method: "DELETE" });
    } catch (error) {
      console.error("Logout error:", error);
    }
    logout();
    setShowUserMenu(false);
    router.push("/");
  };

  const isCustomer = user && user.vai_tro === "khach_hang";

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-800/50"
          : "bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl"
      }`}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="text-2xl font-bold text-primary">
            TravelBook
          </Link>
          
          <div className="hidden gap-8 md:flex">
            <Link
              href="/tours"
              className={`text-sm font-medium transition-colors relative ${
                isActive("/tours")
                  ? "text-primary dark:text-primary/80"
                  : "text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary/80"
              }`}
            >
              Tour
              {isActive("/tours") && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </Link>
            <Link
              href="/blog"
              className={`text-sm font-medium transition-colors relative ${
                isActive("/blog")
                  ? "text-primary dark:text-primary/80"
                  : "text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary/80"
              }`}
            >
              Blog
              {isActive("/blog") && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </Link>
            <Link
              href="/lien-he"
              className={`text-sm font-medium transition-colors relative ${
                isActive("/lien-he")
                  ? "text-primary dark:text-primary/80"
                  : "text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary/80"
              }`}
            >
              Liên hệ
              {isActive("/lien-he") && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            {isAuthenticated && isCustomer ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                    {user.avatar_url ? (
                      <Image
                        src={user.avatar_url}
                        alt={user.ho_ten}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-primary font-semibold text-sm">
                        {user.ho_ten.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.ho_ten}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      showUserMenu ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {user.ho_ten}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Hồ sơ
                      </Link>
                      <Link
                        href="/don-da-dat"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Đơn đã đặt
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 transition-all rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white transition-all rounded-lg bg-primary hover:bg-primary/90"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
