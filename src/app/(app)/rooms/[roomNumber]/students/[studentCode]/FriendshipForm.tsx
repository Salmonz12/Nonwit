"use client";

import { useState } from "react";

export default function FriendshipForm({
  roomNumber,
  toStudentCode,
}: {
  roomNumber: number;
  toStudentCode: string;
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit() {
    setMsg(null);
    const text = message.trim();
    if (!text) return;

    setLoading(true);
    const res = await fetch("/api/friendships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomNumber, toStudentCode, message: text }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMsg("ส่งไม่สำเร็จ: " + (data?.error || "UNKNOWN"));
      return;
    }

    setMessage("");
    setMsg("ส่งเฟรนชิปแล้ว ✅");
  }

  return (
    <div className="rounded-2xl border p-5">
      <div className="text-lg font-semibold">เขียนเฟรนชิปให้เพื่อน</div>
      <p className="text-sm text-black/60 mt-1">
        ข้อความนี้จะเป็นส่วนตัว — มีเจ้าตัวเห็นคนเดียว
      </p>

      <textarea
        className="mt-4 w-full rounded-xl border px-4 py-3 min-h-[120px]"
        placeholder="พิมพ์ข้อความดีๆ..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={280}
      />

      <div className="mt-2 flex items-center justify-between">
        <div className="text-xs text-black/50">{message.length}/280</div>
        <button
          onClick={submit}
          disabled={loading || !message.trim()}
          className="rounded-xl bg-black text-white px-4 py-2 disabled:opacity-50"
        >
          {loading ? "กำลังส่ง..." : "ส่งเฟรนชิป"}
        </button>
      </div>

      {msg ? <div className="mt-3 text-sm">{msg}</div> : null}
    </div>
  );
}
