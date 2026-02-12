"use client";

import { useEffect, useState } from "react";

type From = {
  studentCode: string;
  prefix: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
};

type Item = {
  id: string;
  message: string;
  createdAt: string;
  from: From;
  canDelete: boolean;
};

function fullName(s: From) {
  return [s.prefix, s.firstName, s.lastName].filter(Boolean).join(" ").trim() || s.studentCode;
}

export default function FriendshipList({
  roomNumber,
  toStudentCode,
}: {
  roomNumber: number;
  toStudentCode: string;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setMsg(null);

    const res = await fetch(
      `/api/friendships?roomNumber=${roomNumber}&toStudentCode=${encodeURIComponent(toStudentCode)}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMsg("โหลดเฟรนชิปไม่สำเร็จ");
      return;
    }
    setItems(data.items || []);
  }

  async function remove(id: string) {
    const res = await fetch(`/api/friendships?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) {
      alert("ลบไม่สำเร็จ");
      return;
    }
    // รีโหลด
    load();
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomNumber, toStudentCode]);

  if (loading) return <div className="text-sm text-black/60">กำลังโหลดเฟรนชิป...</div>;
  if (msg) return <div className="text-sm text-red-600">{msg}</div>;

  return (
    <div className="rounded-2xl border p-5">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">เฟรนชิปที่เพื่อนๆเขียนให้</div>
        <button onClick={load} className="text-sm underline text-black/60">
          รีเฟรช
        </button>
      </div>

      {items.length === 0 ? (
        <div className="mt-4 text-sm text-black/60">ยังไม่มีใครเขียนเฟรนชิปให้คนนี้</div>
      ) : (
        <div className="mt-4 grid gap-3">
          {items.map((it) => {
            const name = fullName(it.from);
            const avatar =
              it.from.profileImageUrl ||
              "https://api.dicebear.com/8.x/thumbs/svg?seed=" + encodeURIComponent(it.from.studentCode);

            return (
              <div key={it.id} className="rounded-2xl border p-4">
                <div className="flex items-start gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={avatar} alt={name} className="h-10 w-10 rounded-xl border object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{name}</div>
                        <div className="text-xs text-black/50">{it.from.studentCode}</div>
                      </div>
                      {it.canDelete ? (
                        <button
                          onClick={() => remove(it.id)}
                          className="text-xs rounded-lg border px-2 py-1 hover:bg-black/5"
                        >
                          ลบของฉัน
                        </button>
                      ) : null}
                    </div>

                    <div className="mt-2 text-sm whitespace-pre-wrap">{it.message}</div>
                    <div className="mt-2 text-xs text-black/50">
                      {new Date(it.createdAt).toLocaleString("th-TH")}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
