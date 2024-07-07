import { redirect } from "next/navigation";

export const metadata = {
  title: "Bình Chọn - Bảng Xếp Hạng Light Novel Việt Nam",
};

export default function RootLayout({ children }) {
  const shouldRedirect = false;
  if (shouldRedirect) {
    redirect("/");
  }
  return <div>{children}</div>;
}
