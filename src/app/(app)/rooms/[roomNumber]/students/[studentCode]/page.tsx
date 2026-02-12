import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth-server";
import FriendshipForm from "./FriendshipForm";
import FriendshipList from "./FriendshipList";

function fullName(s: { prefix: string | null; firstName: string | null; lastName: string | null }) {
  return [s.prefix, s.firstName, s.lastName].filter(Boolean).join(" ").trim();
}

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ roomNumber: string; studentCode: string }>;
}) {
  const auth = await getAuth();
  if (!auth) redirect("/enter-code");

  const { roomNumber, studentCode } = await params; // ✅ สำคัญ
  const rn = Number(roomNumber);

  if (!Number.isInteger(rn) || rn < 1 || rn > 12) redirect("/rooms");

  const student = await prisma.student.findUnique({
    where: { studentCode },
    select: {
      id: true,
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

  if (!student) redirect(`/rooms/${rn}`); // หรือ redirect("/rooms")
  if (student.roomNumber !== rn) redirect(`/rooms/${rn}`);

  const name = fullName(student) || student.studentCode;
  const avatar =
    student.profileImageUrl ||
    "https://api.dicebear.com/8.x/thumbs/svg?seed=" + student.studentCode;

  const isMe = auth.sc === student.studentCode;

  return (
    <div className="max-w-4xl p-6">
      <div className="flex items-center justify-between gap-3">
        <Link href={`/rooms/${rn}`} className="rounded-xl border px-4 py-2 hover:bg-black/5">
          ← กลับไปห้อง {rn}
        </Link>
      </div>

      <div className="mt-6 rounded-2xl border p-6">
        <div className="flex items-start gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatar} alt={name} className="h-28 w-28 rounded-2xl border object-cover" />

          <div className="min-w-0">
            <div className="text-2xl font-semibold">{name}</div>
            <div className="text-sm text-black/60 mt-1">
              รหัส: {student.studentCode} • ห้อง: {student.roomNumber}
            </div>

            {student.bio ? (
              <div className="mt-4 text-sm text-black/80 whitespace-pre-wrap">{student.bio}</div>
            ) : (
              <div className="mt-4 text-sm text-black/50">(ยังไม่มี bio)</div>
            )}
          </div>
        </div>
      </div>

     {!isMe ? (
  <div className="mt-6 space-y-4">
    <div className="rounded-2xl border p-4 text-sm text-black/70">
      เฟรนชิปที่คุณเขียนจะเป็น “ส่วนตัว” — มีเจ้าตัวเห็นคนเดียว
    </div>

    <FriendshipForm roomNumber={rn} toStudentCode={student.studentCode} />
  </div>
) : (
  <div className="mt-6 space-y-4">
    <div className="rounded-2xl border p-4 text-sm text-black/70">
      นี่คือเฟรนชิปที่เพื่อนๆเขียนให้คุณ (คุณเห็นคนเดียว)
    </div>

    <FriendshipList roomNumber={rn} toStudentCode={student.studentCode} />
  </div>
)}
    </div>
  );
}
