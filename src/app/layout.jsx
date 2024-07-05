import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const title = "Bảng Xếp Hạng Light Novel Việt Nam";
const description =
  "Đây là bảng xếp hạng Light Novel Việt Nam, nơi sức sáng tạo của tác giả gặp gỡ với đam mê của độc giả. Hãy bình chọn cho tác phẩm yêu thích của bạn!";

export const metadata = {
  title: title,
  description: description,
  creator: "Meoki",
  publisher: "Meoki",
  keywords: [
    "ranking",
    "rank",
    "light novel",
    "novel",
    "bxh",
    "vote",
    "bxhlnvn",
    "bảng xếp hạng",
    "bình chọn",
  ],
  metadataBase: new URL("https://vnlnranking.moe"),
  openGraph: {
    title: title,
    description: description,
    images: "/meta.jpg",
    url: "https://vnlnranking.moe",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
    url: "https://vnlnranking.moe",
    images: "/meta.jpg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <div id="root">{children}</div>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA4} />
    </html>
  );
}
