import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { studentCode, inviteCode, newPassword } = await req.json();

  if (!studentCode || !inviteCode || !newPassword) {
    return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });
  }

  const student = await prisma.student.findUnique({
    where: { studentCode: String(studentCode).trim() },
    select: { id: true, hasPassword: true },
  });
  if (!student) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  if (student.hasPassword) return NextResponse.json({ error: "ALREADY_SET" }, { status: 400 });

  const now = new Date();

  // หา invite ทั้งหมดที่ "ยังไม่ใช้" และ "ยังไม่หมดอายุ" ของคนนี้
  const invites = await prisma.inviteCode.findMany({
    where: {
      studentId: student.id,
      usedAt: null,
      expiresAt: { gt: now },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, codeHash: true, expiresAt: true },
  });

  if (invites.length === 0) {
    return NextResponse.json({ error: "NO_INVITE" }, { status: 400 });
  }

  // เทียบโค้ดกับ hash
  const raw = String(inviteCode).trim();
  const matched = await (async () => {
    for (const inv of invites) {
      const ok = await bcrypt.compare(raw, inv.codeHash);
      if (ok) return inv;
    }
    return null;
  })();

  if (!matched) return NextResponse.json({ error: "INVITE_WRONG" }, { status: 400 });

  // ตั้งรหัสผ่าน + ใช้ invite ครั้งเดียว (ทำเป็น transaction)
  const passwordHash = await bcrypt.hash(String(newPassword), 10);

  await prisma.$transaction([
    prisma.student.update({
      where: { id: student.id },
      data: { passwordHash, hasPassword: true },
    }),
    prisma.inviteCode.update({
      where: { id: matched.id },
      data: { usedAt: now },
    }),
  ]);

  return NextResponse.json({ success: true });
}
