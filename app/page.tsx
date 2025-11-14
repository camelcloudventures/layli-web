import { redirect } from "next/navigation";

export default function RootPage() {
  //test push
  redirect("/auth/login");
}
