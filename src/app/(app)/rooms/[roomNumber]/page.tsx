import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

function fullName(s: {
  prefix: string | null;
  firstName: string | null;
  lastName: string | null;
}) {
  return [s.prefix, s.firstName, s.lastName].filter(Boolean).join(" ").trim();
}

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomNumber: string }>;
}) {
  const auth = await getAuth();
  if (!auth) redirect("/login");

  const { roomNumber } = await params;
  const rn = Number(roomNumber);

  if (!Number.isInteger(rn) || rn < 1 || rn > 12) {
    redirect("/rooms");
  }

  const students = await prisma.student.findMany({
    where: { roomNumber: rn },
    orderBy: [{ studentCode: "asc" }],
    select: {
      id: true,
      studentCode: true,
      prefix: true,
      firstName: true,
      lastName: true,
      profileImageUrl: true,
    },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">ห้อง {rn}</h1>
          <p className="mt-1 text-sm text-black/60">
            ทั้งหมด {students.length} คน
          </p>
        </div>

        <Link
          href="/rooms"
          className="rounded-xl border px-4 py-2 hover:bg-black/5"
        >
          ← กลับไปเลือกห้อง
        </Link>
      </div>

<div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
  {students.map((s) => {
    const name = fullName(s) || "(ยังไม่มีชื่อ)";
    const avatar =
      s.profileImageUrl ||
      "https://api.dicebear.com/8.x/thumbs/svg?seed=" + s.studentCode;

          return (
      <Link
        key={s.id}
        href={`/rooms/${rn}/students/${s.studentCode}`}
        className="rounded-2xl border p-5 hover:bg-black/5 block"
      >
        <div className="flex flex-col items-center text-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatar}
            alt={name}
            className="h-20 w-20 rounded-2xl object-cover border"
          />
          <div className="min-w-0 w-full">
            <div className="font-semibold truncate">{name}</div>
            <div className="text-sm text-black/60">{s.studentCode}</div>
          </div>

          <div className="w-full mt-1">
            <span className="inline-block w-full rounded-xl border px-3 py-2 text-sm hover:bg-black/5">
              ดูรายละเอียด / เขียนเฟรนชิป
            </span>
          </div>
        </div>
      </Link>
    );
  })}
</div>

      {students.length === 0 && (
        <div className="mt-6 rounded-2xl border p-4 text-sm text-black/60">
          ห้องนี้ยังไม่มีข้อมูลในฐานข้อมูล
        </div>
      )}
    </div>
  );
}
