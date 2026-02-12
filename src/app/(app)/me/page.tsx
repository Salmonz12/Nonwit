import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth-server";
import FriendshipList from "../rooms/[roomNumber]/students/[studentCode]/FriendshipList";

function fullName(s: { prefix: string | null; firstName: string | null; lastName: string | null }) {
  return [s.prefix, s.firstName, s.lastName].filter(Boolean).join(" ").trim();
}

export default async function MePage() {
  const auth = await getAuth();
  if (!auth) redirect("/enter-code");

  const me = await prisma.student.findUnique({
    where: { studentCode: auth.sc },
    select: {
      studentCode: true,
      prefix: true,
      firstName: true,
      lastName: true,
      roomNumber: true,
      profileImageUrl: true,
      bio: true,
      contactFacebook: true,
      contactIg: true,
      contactLine: true,
    },
  });

  if (!me) redirect("/enter-code");

  const name = fullName(me) || me.studentCode;
  const avatar =
    me.profileImageUrl || "https://api.dicebear.com/8.x/thumbs/svg?seed=" + encodeURIComponent(me.studentCode);

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">โปรไฟล์ของฉัน</h1>
          <p className="mt-1 text-sm text-black/60">ดูข้อมูลของตัวเอง + เฟรนชิปส่วนตัว</p>
        </div>

        <div className="flex gap-2">
          <Link href={`/rooms/${me.roomNumber}`} className="rounded-xl border px-4 py-2 hover:bg-black/5">
            ไปห้อง {me.roomNumber}
          </Link>
          <Link href="/logout" className="rounded-xl border px-4 py-2 hover:bg-black/5">
            ออกจากระบบ
          </Link>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border p-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatar} alt={name} className="h-28 w-28 rounded-2xl border object-cover" />

          <div className="min-w-0 flex-1">
            <div className="text-2xl font-semibold">{name}</div>
            <div className="text-sm text-black/60 mt-1">
              รหัส: {me.studentCode} • ห้อง: {me.roomNumber}
            </div>

            {me.bio ? (
              <div className="mt-4 text-sm whitespace-pre-wrap">{me.bio}</div>
            ) : (
              <div className="mt-4 text-sm text-black/50">(ยังไม่มี bio)</div>
            )}

            <div className="mt-4 grid sm:grid-cols-3 gap-2 text-sm">
              <div className="rounded-xl border p-3">
                <div className="text-black/60">Facebook</div>
                <div className="truncate">{me.contactFacebook || "-"}</div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-black/60">Instagram</div>
                <div className="truncate">{me.contactIg || "-"}</div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-black/60">LINE</div>
                <div className="truncate">{me.contactLine || "-"}</div>
              </div>
            </div>

            <div className="mt-4">
              <Link
                href="/profile"
                className="inline-flex rounded-xl bg-black text-white px-4 py-2 hover:opacity-90"
              >
                แก้โปรไฟล์/รูป
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ เฟรนชิปส่วนตัว (เจ้าตัวเห็นคนเดียว) */}
      <div className="mt-6">
        <FriendshipList roomNumber={me.roomNumber} toStudentCode={me.studentCode} />
      </div>
    </div>
  );
}
