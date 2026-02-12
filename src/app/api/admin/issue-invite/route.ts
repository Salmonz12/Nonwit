import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth-server";

export async function POST(req: Request) {
  const auth = await getAuth();
  if (!auth || auth.role !== "ADMIN") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const { studentCode, minutes = 60 } = await req.json();
  if (!studentCode) return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });

  const student = await prisma.student.findUnique({
    where: { studentCode: String(studentCode) },
    select: { id: true, hasPassword: true },
  });
  if (!student) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  // ออก invite ได้แม้เคยตั้งแล้วหรือไม่ก็ได้ (คุณจะ strict ก็ได้)
  const codePlain = nanoid(8).toUpperCase(); // เช่น X9K2ABCD
  const codeHash = await bcrypt.hash(codePlain, 10);

  const expiresAt = new Date(Date.now() + Number(minutes) * 60 * 1000);

  await prisma.inviteCode.create({
    data: {
      studentId: student.id,
      codeHash,
      expiresAt,
    },
  });

  // ส่ง codePlain กลับ “ครั้งเดียว” ให้แอดมินเอาไปส่งต่อ
  return NextResponse.json({ code: codePlain, expiresAt });
}
