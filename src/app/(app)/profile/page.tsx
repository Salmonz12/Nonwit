"use client";

import { UploadButton } from "@/lib/uploadthing";
import { useEffect, useState } from "react";
import ProfileImageUploader from "@/components/ProfileImageUploader";
type Me = {
  studentCode: string;
  prefix: string | null;
  firstName: string | null;
  lastName: string | null;
  roomNumber: number;
  profileImageUrl: string | null;
  bio: string | null;
  contactFacebook: string | null;
  contactIg: string | null;
  contactLine: string | null;
  role: "ADMIN" | "STUDENT";
};

function fullName(me: Me) {
  return [me.prefix, me.firstName, me.lastName].filter(Boolean).join(" ").trim() || me.studentCode;
}

export default function ProfilePage() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // ฟอร์ม
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [bio, setBio] = useState("");
  const [contactFacebook, setContactFacebook] = useState("");
  const [contactIg, setContactIg] = useState("");
  const [contactLine, setContactLine] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch("/api/me");
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMsg("โหลดโปรไฟล์ไม่สำเร็จ (อาจหลุดล็อกอิน)");
        return;
      }

      const m: Me = data.me;
      setMe(m);
      setProfileImageUrl(m.profileImageUrl ?? "");
      setBio(m.bio ?? "");
      setContactFacebook(m.contactFacebook ?? "");
      setContactIg(m.contactIg ?? "");
      setContactLine(m.contactLine ?? "");
    })();
  }, []);

  async function onSave() {
    if (!me) return;
    setMsg(null);
    setSaving(true);

    const res = await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profileImageUrl,
        bio,
        contactFacebook,
        contactIg,
        contactLine,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setMsg("บันทึกไม่สำเร็จ ลองใหม่");
      return;
    }

    setMe(data.me);
    setMsg("บันทึกแล้ว ✅");
  }

  if (loading) return <div>กำลังโหลดโปรไฟล์...</div>;
  if (!me) return <div className="text-red-600">ไม่พบข้อมูลโปรไฟล์</div>;

  const avatar =
    me.profileImageUrl ||
    "https://api.dicebear.com/8.x/thumbs/svg?seed=" + encodeURIComponent(me.studentCode);

  return (
    <div className="max-w-3xl">
      <div className="flex items-start gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={avatar} alt="avatar" className="h-20 w-20 rounded-2xl border object-cover" />

        <div className="min-w-0">
          <h1 className="text-2xl font-semibold truncate">{fullName(me)}</h1>
          <div className="text-sm text-gray-500 mt-1">
            รหัส: {me.studentCode} • ห้อง: {me.roomNumber} • role: {me.role}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        <div className="rounded-2xl border p-4">
          <div className="font-semibold">รูปโปรไฟล์</div>
          <p className="text-sm text-gray-500 mt-1">ใส่ URL รูป (ตอนนี้ยังไม่ทำอัปโหลดไฟล์)</p>
          <ProfileImageUploader
                onUploaded={(url) => {
                setProfileImageUrl(url);
                setMsg("อัปโหลดเสร็จแล้ว กดบันทึกเพื่อยืนยัน ✅");
                }}
         />
        {profileImageUrl ? (
            <div className="mt-3 text-xs break-all text-gray-600">
      URL: {profileImageUrl}
    </div>
  ) : null}
        </div>

        <div className="rounded-2xl border p-4">
          <div className="font-semibold">แนะนำตัว</div>
          <p className="text-sm text-gray-500 mt-1">ได้สูงสุด 280 ตัวอักษร</p>
          <textarea
            className="mt-3 w-full rounded-xl border px-4 py-3 min-h-[120px]"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={280}
            placeholder="เขียนอะไรสั้นๆเกี่ยวกับตัวเอง..."
          />
          <div className="text-xs text-gray-500 mt-1">{bio.length}/280</div>
        </div>

        <div className="rounded-2xl border p-4">
          <div className="font-semibold">ช่องทางติดต่อ</div>

          <div className="mt-3 grid gap-2">
            <input
              className="w-full rounded-xl border px-4 py-3"
              placeholder="Facebook (ลิงก์หรือชื่อ)"
              value={contactFacebook}
              onChange={(e) => setContactFacebook(e.target.value)}
            />
            <input
              className="w-full rounded-xl border px-4 py-3"
              placeholder="Instagram (เช่น @name)"
              value={contactIg}
              onChange={(e) => setContactIg(e.target.value)}
            />
            <input
              className="w-full rounded-xl border px-4 py-3"
              placeholder="LINE (เช่น id หรือ @id)"
              value={contactLine}
              onChange={(e) => setContactLine(e.target.value)}
            />
          </div>
        </div>

        {msg ? <div className="text-sm text-gray-700">{msg}</div> : null}

        <button
          onClick={onSave}
          disabled={saving}
          className="rounded-xl bg-black text-white px-4 py-3 disabled:opacity-50"
        >
          {saving ? "กำลังบันทึก..." : "บันทึกโปรไฟล์"}
        </button>
      </div>
    </div>
  );
}
