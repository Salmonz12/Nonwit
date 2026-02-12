import { ReactNode } from "react";
import Link from "next/link";
import { getAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function AppLayout({ children }: { children: ReactNode }) {
  const auth = getAuth();
  if (auth === undefined || auth === null) redirect("/enter-code");

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r p-4">
        <div className="text-xl font-semibold">เว็บรุ่น</div>
        <nav className="mt-6 space-y-2 text-sm">
          <Link className="block rounded-xl px-3 py-2 hover:bg-gray-100" href="/">เมนูหลัก</Link>
          <Link className="block rounded-xl px-3 py-2 hover:bg-gray-100" href="/rooms">เลือกห้อง</Link>
          <Link className="block rounded-xl px-3 py-2 hover:bg-gray-100" href="/board">บอร์ด</Link>
          <Link className="block rounded-xl px-3 py-2 hover:bg-gray-100" href="/me">โปรไฟล์ฉัน</Link>

          <form action="/api/auth/logout" method="post">
            <button className="w-full text-left rounded-xl px-3 py-2 hover:bg-gray-100">
              ออกจากระบบ
            </button>
          </form>
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
