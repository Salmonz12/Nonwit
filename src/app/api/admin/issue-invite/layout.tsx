import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r p-4">
        <div className="font-semibold text-lg">Admin</div>
        <nav className="mt-4 space-y-2">
          <Link className="block rounded-lg px-3 py-2 hover:bg-black/5" href="/admin/invites">
            ออก Invite
          </Link>
          <Link className="block rounded-lg px-3 py-2 hover:bg-black/5" href="/">
            กลับหน้าเว็บ
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
