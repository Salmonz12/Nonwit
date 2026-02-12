import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth-server";
import bcrypt from "bcryptjs";
import crypto from "crypto";

function makeCode(len = 8) {
  // โค้ดอ่านง่าย: ตัวใหญ่ + ตัวเลข (ตัด O/0, I/1 ออก)
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function GET() {
  const auth = await getAuth();
  if (!auth) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  if (auth.role !== "ADMIN") return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  const invites = await prisma.inviteCode.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      expiresAt: true,
      usedAt: true,
      createdAt: true,
      student: { select: { studentCode: true, firstName: true, lastName: true, prefix: true, roomNumber: true } },
    },
  });

  return NextResponse.json({ invites });
}

export async function POST(req: Request) {
  const auth = await getAuth();
  if (!auth) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  if (auth.role !== "ADMIN") return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  const body = await req.json();
  const studentCode = String(body.studentCode || "").trim();
  const minutes = Number(body.minutes ?? 10); // default 10 นาที

  if (!studentCode) return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });

  const student = await prisma.student.findUnique({
    where: { studentCode },
    select: { id: true, hasPassword: true },
  });
  if (!student) return NextResponse.json({ error: "STUDENT_NOT_FOUND" }, { status: 404 });
  if (student.hasPassword) return NextResponse.json({ error: "ALREADY_SET" }, { status: 400 });

  // ถ้ามี invite เดิมที่ยังไม่หมดอายุและยังไม่ใช้ ให้ยกเลิก (ลบ) ก่อน
  const now = new Date();
  await prisma.inviteCode.deleteMany({
    where: { studentId: student.id, usedAt: null, expiresAt: { gt: now } },
  });

  // สร้างโค้ดใหม่
  const raw = makeCode(8) + "-" + makeCode(4); // เช่น ABCD2345-X7K9
  const codeHash = await bcrypt.hash(raw, 10);

  const expiresAt = new Date(Date.now() + Math.max(1, Math.min(minutes, 60)) * 60_000);

  const created = await prisma.inviteCode.create({
    data: { studentId: student.id, codeHash, expiresAt },
    select: { id: true, expiresAt: true },
  });

  // ส่ง "โค้ดจริง" กลับให้ admin เห็นครั้งเดียว
  return NextResponse.json({ inviteId: created.id, inviteCode: raw, expiresAt: created.expiresAt });
}
