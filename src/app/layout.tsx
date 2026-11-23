import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/config";
import SmoothScroll from "@/components/ui/smooth-scroll";
import Nav from "@/components/ui/nav";
import Splash from "@/components/ui/splash";

/** Runs before the first paint, so a reader who has already seen the splash this session never sees it flash. */
const SPLASH_SCRIPT = `try{document.documentElement.dataset.splash=sessionStorage.getItem("splash")?"seen":"on"}catch(e){document.documentElement.dataset.splash="seen"}`;

const fraunces = Fraunces({
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});
const bevn = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500"],
  variable: "--font-bevn",
  display: "swap",
});
const jbmono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
  variable: "--font-jbmono",
  display: "swap",
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

export const viewport: Viewport = { themeColor: "#f1ebde" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${fraunces.variable} ${bevn.variable} ${jbmono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SPLASH_SCRIPT }} />
      </head>
      <body>
        <SmoothScroll>
          <Splash />
          <Nav />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
