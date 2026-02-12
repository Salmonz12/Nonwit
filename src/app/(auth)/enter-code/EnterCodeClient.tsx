"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EnterCodeClient() {
  const router = useRouter();
  const [studentCode, setStudentCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/check-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentCode }),
      });
      const data = await res.json();

      if (!data.exists) {
        setMsg("ไม่พบเลขประจำตัวนี้ในระบบ");
        return;
      }

      if (data.hasPassword) {
        router.push("/login?studentCode=" + studentCode);
      } else {
        router.push("/set-password?studentCode=" + studentCode);
      }
    } catch {
      setMsg("มีบางอย่างพัง ลองใหม่");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">เข้าสู่ระบบเว็บรุ่น</h1>
        <p className="text-sm text-gray-500 mt-1">ใส่เลขประจำตัวนักเรียนของคุณ</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            className="w-full rounded-xl border px-4 py-3 outline-none focus:ring"
            placeholder="เลขประจำตัว"
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value.replace(/\D/g, ""))}
          />
          {msg && <div className="text-sm text-red-600">{msg}</div>}
          <button
            disabled={loading || !studentCode}
            className="w-full rounded-xl bg-black text-white py-3 disabled:opacity-50"
          >
            {loading ? "กำลังเช็ค..." : "ถัดไป"}
          </button>
        </form>
      </div>
    </div>
  );
}
