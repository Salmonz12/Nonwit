import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth-server";
import EnterCodeClient from "./EnterCodeClient";

export default async function EnterCodePage() {
  const auth = await getAuth();

  // ล็อกอินแล้ว ไม่ต้องอยู่หน้านี้
  if (auth) redirect("/rooms");

  return <EnterCodeClient />;
}
