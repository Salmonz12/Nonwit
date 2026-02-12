"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function NavItem({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={
        "block rounded-xl px-3 py-2 text-sm border " +
        (active ? "bg-black text-white border-black" : "hover:bg-black/5 border-transparent")
      }
    >
      {label}
    </Link>
  );
}

export default function AppShell({
  children,
  role,
}: {
  children: React.ReactNode;
  role: "STUDENT" | "ADMIN";
}) {
  return (
    <div className="min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 border-r min-h-screen p-4 sticky top-0">
          <div className="font-semibold text-lg">เว็บรุ่น</div>
          <div className="text-xs text-black/60 mt-1">เมนู</div>

          <nav className="mt-4 space-y-2">
            <NavItem href="/rooms" label="เลือกห้อง" />
            <NavItem href="/board" label="บอร์ด" />
            <NavItem href="/me" label="โปรไฟล์ฉัน" />

            {role === "ADMIN" ? (
              <NavItem href="/admin/invites" label="Admin: ออก Invite" />
            ) : null}

            <a
              href="/logout"
              className="block rounded-xl px-3 py-2 text-sm border hover:bg-black/5"
            >
              ออกจากระบบ
            </a>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
