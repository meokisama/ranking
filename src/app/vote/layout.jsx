import { redirect } from "next/navigation";
import { isVotingPeriod } from "@/utils/date-config";

export const metadata = {
  title: "Bình Chọn",
};

export default function RootLayout({ children }) {
  const shouldRedirect = !isVotingPeriod();

  // if (false) {
  //   redirect("/");
  // }

  return <div>{children}</div>;
}
