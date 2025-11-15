import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { ToastProvider } from "@/context/ToastContext";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TravelBook - Website Đặt Tour Du Lịch",
  description: "Website đặt tour du lịch đơn giản, giúp bạn dễ dàng tìm và đặt tour phù hợp",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
          <ToastProvider>
            <QueryProvider>{children}</QueryProvider>
          </ToastProvider>
      </body>
    </html>
  );
}
