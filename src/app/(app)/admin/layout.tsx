import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth-server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = await getAuth();
  if (!auth) redirect("/enter-code");
  if (auth.role !== "ADMIN") redirect("/rooms");
  return children;
}
