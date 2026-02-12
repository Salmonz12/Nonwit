"use client";

export default function LogoutButton() {
  return (
    <button
      className="w-full rounded-xl border px-4 py-2 hover:bg-black/5"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/enter-code";
      }}
    >
      ออกจากระบบ
    </button>
  );
}
