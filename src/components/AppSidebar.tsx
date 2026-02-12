"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

type AuthPayload = { sc: string; role: "ADMIN" | "STUDENT" };

export default function AppSidebar({ auth }: { auth: AuthPayload }) {
  const pathname = usePathname();

  const item = (href: string, label: string) => {
    const active = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={href}
        className={`block rounded-xl px-3 py-2 ${
          active ? "bg-black text-white" : "hover:bg-black/5"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <aside className="w-64 border-r p-4">
      <div className="rounded-2xl border p-3">
        <div className="text-sm text-gray-500">ผู้ใช้</div>
        <div className="font-semibold">{auth.sc}</div>
        <div className="text-xs text-gray-500">role: {auth.role}</div>
      </div>

      <nav className="mt-4 space-y-1">
        {item("/rooms", "เลือกห้อง")}
        {item("/me", "โปรไฟล์ฉัน")}
        {item("/board", "บอร์ด")}

        {auth.role === "ADMIN" ? item("/admin/invites", "Admin: ออก Invite") : null}
      </nav>

      <div className="mt-6">
        <LogoutButton />
      </div>
    </aside>
  );
}
