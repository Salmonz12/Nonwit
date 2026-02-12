import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth-server";
import AppSidebar from "@/components/AppSidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const auth = await getAuth();
  if (!auth) redirect("/enter-code");

  return (
    <div className="min-h-screen flex">
      <AppSidebar auth={auth} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
