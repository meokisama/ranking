import { Metadata } from "next";
import localFont from "next/font/local";
import {
  Lexend,
  Playfair_Display,
  Poppins,
  Imperial_Script,
} from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.scss";
import { NotificationProvider } from "@/utils/Notification";
import { Providers } from "@/components/common/provider";

const DTPhudu = localFont({
  src: "./DTPhudu-Black.otf",
  variable: "--font-phudu",
  display: "swap",
});
const jaro = localFont({
  src: "./Jaro.ttf",
  variable: "--font-jaro",
  display: "swap",
});
const imperial = Imperial_Script({
  subsets: ["vietnamese"],
  variable: "--font-imperial-script",
  weight: "400",
  display: "swap",
});
const lexend = Lexend({
  subsets: ["vietnamese"],
  variable: "--font-lexend",
  display: "swap",
});
const playfair_display = Playfair_Display({
  subsets: ["vietnamese"],
  variable: "--font-playfair_display",
  display: "swap",
});
const poppins = Poppins({
  weight: "900",
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const title = "Bảng Xếp Hạng Light Novel Việt Nam";
const description =
  "Đây là bảng xếp hạng Light Novel Việt Nam, nơi sức sáng tạo của tác giả gặp gỡ với đam mê của độc giả. Hãy bình chọn cho tác phẩm yêu thích của bạn!";

export const metadata: Metadata = {
  title: {
    template: "%s | Bảng Xếp Hạng Light Novel Việt Nam",
    default: title,
  },
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
    "bảng xếp hạng light novel việt nam",
    "bxh ln vn",
  ],
  metadataBase: new URL("https://bxh.lightnovel.vn"),
  openGraph: {
    title: title,
    description: description,
    url: "https://bxh.lightnovel.vn",
    siteName: title,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${DTPhudu.variable} ${jaro.variable} ${lexend.variable} ${playfair_display.variable} ${poppins.variable} ${imperial.variable}`}
      suppressHydrationWarning
    >
      <body>
        <NotificationProvider>
          <Providers>
            <div id="root">{children}</div>
          </Providers>
        </NotificationProvider>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA4 as string} />
    </html>
  );
}
