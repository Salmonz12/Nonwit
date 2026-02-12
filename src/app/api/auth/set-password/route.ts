import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { studentCode, password } = await req.json();

  if (!studentCode || !password) {
    return NextResponse.json(
      { error: "ข้อมูลไม่ครบ" },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "รหัสผ่านต้องอย่างน้อย 8 ตัว" },
      { status: 400 }
    );
  }

  const student = await prisma.student.findUnique({
    where: { studentCode },
  });

  if (!student) {
    return NextResponse.json(
      { error: "ไม่พบนักเรียน" },
      { status: 404 }
    );
  }

  if (student.hasPassword) {
    return NextResponse.json(
      { error: "บัญชีนี้ตั้งรหัสแล้ว" },
      { status: 400 }
    );
  }

  const hash = await bcrypt.hash(password, 10);

  await prisma.student.update({
    where: { studentCode },
    data: {
      passwordHash: hash,
      hasPassword: true,
    },
  });

  return NextResponse.json({ success: true });
}
