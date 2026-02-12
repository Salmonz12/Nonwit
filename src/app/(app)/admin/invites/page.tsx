"use client";

import { useEffect, useState } from "react";

type InviteRow = {
  id: string;
  expiresAt: string;
  usedAt: string | null;
  createdAt: string;
  student: {
    studentCode: string;
    prefix: string | null;
    firstName: string | null;
    lastName: string | null;
    roomNumber: number;
  };
};

function fullName(s: InviteRow["student"]) {
  return [s.prefix, s.firstName, s.lastName].filter(Boolean).join(" ").trim() || s.studentCode;
}

export default function AdminInvitesPage() {
  const [studentCode, setStudentCode] = useState("");
  const [minutes, setMinutes] = useState(10);
  const [loading, setLoading] = useState(false);
  const [invites, setInvites] = useState<InviteRow[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [lastCode, setLastCode] = useState<string | null>(null);
  const [lastExp, setLastExp] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/invites", { cache: "no-store" });
    const data = await res.json();
    if (res.ok) setInvites(data.invites || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function createInvite() {
    setLoading(true);
    setMsg(null);
    setLastCode(null);
    setLastExp(null);

    const res = await fetch("/api/admin/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentCode, minutes }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      const map: Record<string, string> = {
        STUDENT_NOT_FOUND: "ไม่พบเลขนักเรียนนี้",
        ALREADY_SET: "คนนี้ตั้งรหัสไปแล้ว",
      };
      setMsg(map[data?.error] ?? "สร้าง Invite ไม่สำเร็จ");
      return;
    }

    setLastCode(data.inviteCode);
    setLastExp(new Date(data.expiresAt).toLocaleString("th-TH"));
    setStudentCode("");
    await load();
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold">Admin: ออก Invite</h1>
      <p className="mt-1 text-sm text-black/60">
        สร้างโค้ดให้คนมาตั้งรหัสครั้งแรก (หมดอายุ + ใช้ครั้งเดียว)
      </p>

      <div className="mt-6 rounded-2xl border p-5 space-y-3">
        <div className="grid sm:grid-cols-3 gap-2">
          <input
            className="rounded-xl border px-4 py-3"
            placeholder="studentCode เช่น 07353"
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value)}
          />
          <input
            type="number"
            className="rounded-xl border px-4 py-3"
            min={1}
            max={60}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
          />
          <button
            disabled={loading || !studentCode.trim()}
            onClick={createInvite}
            className="rounded-xl bg-black text-white px-4 py-3 disabled:opacity-50"
          >
            {loading ? "กำลังสร้าง..." : "สร้าง Invite"}
          </button>
        </div>

        {msg ? <div className="text-sm text-red-600">{msg}</div> : null}

        {lastCode ? (
          <div className="rounded-2xl border p-4">
            <div className="text-sm text-black/60">Invite ล่าสุด (แสดงครั้งเดียว)</div>
            <div className="mt-2 text-xl font-semibold">{lastCode}</div>
            <div className="mt-1 text-sm text-black/60">หมดอายุ: {lastExp}</div>
            <button
              className="mt-3 rounded-xl border px-3 py-2 text-sm hover:bg-black/5"
              onClick={() => navigator.clipboard.writeText(lastCode)}
            >
              คัดลอกโค้ด
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-6 rounded-2xl border p-5">
        <div className="flex items-center justify-between">
          <div className="font-semibold">รายการ Invite ล่าสุด</div>
          <button onClick={load} className="text-sm underline text-black/60">
            รีเฟรช
          </button>
        </div>

        <div className="mt-4 grid gap-2">
          {invites.map((x) => {
            const used = x.usedAt ? "✅ ใช้แล้ว" : "⏳ ยังไม่ใช้";
            const exp = new Date(x.expiresAt).toLocaleString("th-TH");
            const created = new Date(x.createdAt).toLocaleString("th-TH");

            return (
              <div key={x.id} className="rounded-2xl border p-4">
                <div className="font-semibold">
                  {fullName(x.student)} ({x.student.studentCode}) • ห้อง {x.student.roomNumber}
                </div>
                <div className="text-sm text-black/60 mt-1">
                  สถานะ: {used} • สร้างเมื่อ: {created} • หมดอายุ: {exp}
                </div>
              </div>
            );
          })}

          {invites.length === 0 ? (
            <div className="text-sm text-black/60">ยังไม่มี invite</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
