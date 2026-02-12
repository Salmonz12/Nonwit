import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { studentCode } = await req.json();

  if (!studentCode) {
    return NextResponse.json({ error: "missing studentCode" }, { status: 400 });
  }

  const student = await prisma.student.findUnique({
    where: { studentCode },
    select: { id: true, hasPassword: true },
  });

  if (!student) {
    return NextResponse.json({ exists: false });
  }

  return NextResponse.json({
    exists: true,
    hasPassword: student.hasPassword,
  });
}
