"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const params = useSearchParams();
  const router = useRouter();
  const preset = params.get("studentCode") ?? "";
  const [studentCode, setStudentCode] = useState(preset);
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentCode, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMsg(data?.error === "WRONG" ? "รหัสผ่านไม่ถูก" : "เข้าสู่ระบบไม่ได้");
      return;
    }
    const next = new URLSearchParams(window.location.search).get("next") || "/rooms";
    window.location.href = next;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">เข้าสู่ระบบ</h1>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            className="w-full rounded-xl border px-4 py-3"
            placeholder="เลขประจำตัว"
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value)}
          />
          <input
            type="password"
            className="w-full rounded-xl border px-4 py-3"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {msg && <div className="text-sm text-red-600">{msg}</div>}
          <button
            disabled={loading || !studentCode || !password}
            className="w-full rounded-xl bg-black text-white py-3 disabled:opacity-50"
          >
            {loading ? "กำลังเข้า..." : "เข้าเว็บรุ่น"}
          </button>
        </form>

        <button
          className="mt-3 text-sm text-gray-600 underline"
          onClick={() => router.push("/enter-code")}
        >
          กลับไปกรอกเลขประจำตัวใหม่
        </button>
      </div>
    </div>
  );
}
