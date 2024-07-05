import { redirect } from "next/navigation";

const title = "Bình Chọn - Bảng Xếp Hạng Light Novel Việt Nam";
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
    url: "https://vnlnranking.moe/vote",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
    url: "https://vnlnranking.moe/vote",
    images: "/meta.jpg",
  },
};

export default function RootLayout({ children }) {
  const shouldRedirect = true;
  if (shouldRedirect) {
    redirect("/");
  }
  return <div>{children}</div>;
}
