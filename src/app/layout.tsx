import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Fraunces, JetBrains_Mono, Phudu, Shippori_Mincho } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/config";
import SmoothScroll from "@/components/ui/smooth-scroll";
import Nav from "@/components/ui/nav";

const phudu = Phudu({ subsets: ["latin", "vietnamese"], variable: "--font-phudu", display: "swap" });
const bevn = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-bevn",
  display: "swap",
});
const fraunces = Fraunces({
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});
const jbmono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
  variable: "--font-jbmono",
  display: "swap",
});
const mincho = Shippori_Mincho({
  weight: ["800"],
  variable: "--font-mincho",
  display: "swap",
  preload: false,
});

const description =
  "Bảng xếp hạng Light Novel Việt Nam, nơi sức sáng tạo của tác giả gặp gỡ đam mê của độc giả. Xem kết quả bình chọn qua từng kỳ.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { template: `%s | ${SITE.short}`, default: SITE.name },
  description,
  keywords: ["bảng xếp hạng light novel", "light novel việt nam", "bxh lnvn", "bình chọn light novel", "ranking"],
  openGraph: { title: SITE.name, description, url: SITE.url, siteName: SITE.name, type: "website", locale: "vi_VN" },
  twitter: { card: "summary_large_image", title: SITE.name, description },
};

export const viewport: Viewport = { themeColor: "#0c0b0a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="vi"
      className={`${phudu.variable} ${bevn.variable} ${fraunces.variable} ${jbmono.variable} ${mincho.variable}`}
    >
      <body>
        <SmoothScroll>
          <Nav />
          {children}
        </SmoothScroll>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
