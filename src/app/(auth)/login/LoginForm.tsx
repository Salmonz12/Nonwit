"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const params = useSearchParams();
  const router = useRouter();

  const preset = params.get("studentCode") ?? "";
  const [studentCode, setStudentCode] = useState(preset);
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentCode, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMsg("เข้าสู่ระบบไม่ได้");
      return;
    }

    window.location.href = "/rooms";
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        value={studentCode}
        onChange={(e) => setStudentCode(e.target.value)}
        placeholder="เลขประจำตัว"
        className="w-full border px-4 py-2 rounded-xl"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="รหัสผ่าน"
        className="w-full border px-4 py-2 rounded-xl"
      />
      {msg && <div className="text-red-500 text-sm">{msg}</div>}
      <button
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded-xl"
      >
        {loading ? "กำลังเข้า..." : "เข้าสู่ระบบ"}
      </button>
    </form>
  );
}
