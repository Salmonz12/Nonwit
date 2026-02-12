"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function SetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const preset = params.get("studentCode") ?? "";

  const [studentCode, setStudentCode] = useState(preset);
  const [inviteCode, setInviteCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (newPassword !== confirm) {
      setMsg("รหัสผ่านไม่ตรงกัน");
      return;
    }
    setLoading(true);

    const res = await fetch("/api/auth/register-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentCode, inviteCode, newPassword }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      const map: Record<string, string> = {
        NO_INVITE: "ยังไม่มีโค้ดตั้งรหัส (ให้แอดมินออกโค้ดก่อน)",
        INVITE_WRONG: "Invite code ไม่ถูก",
        ALREADY_SET: "บัญชีนี้ตั้งรหัสไปแล้ว",
      };
      setMsg(map[data?.error] ?? "ตั้งรหัสไม่สำเร็จ");
      return;
    }

    router.push(`/login?studentCode=${encodeURIComponent(studentCode)}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">ตั้งรหัสผ่านครั้งแรก</h1>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            className="w-full rounded-xl border px-4 py-3"
            placeholder="เลขประจำตัว"
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value)}
          />
          <input
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Invite code (จากแอดมิน)"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
          />
          <input
            type="password"
            className="w-full rounded-xl border px-4 py-3"
            placeholder="รหัสผ่านใหม่ (อย่างน้อย 8 ตัว)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            className="w-full rounded-xl border px-4 py-3"
            placeholder="ยืนยันรหัสผ่าน"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          {msg && <div className="text-sm text-red-600">{msg}</div>}

          <button
            disabled={loading || !studentCode || !inviteCode || !newPassword || !confirm}
            className="w-full rounded-xl bg-black text-white py-3 disabled:opacity-50"
          >
            {loading ? "กำลังตั้ง..." : "ตั้งรหัสผ่าน"}
          </button>
        </form>
      </div>
    </div>
  );
}
