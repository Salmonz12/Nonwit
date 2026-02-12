import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth-server";

// ✅ สร้างเฟรนชิป (คนอื่นเขียนให้ได้)
export async function POST(req: Request) {
  const auth = await getAuth();
  if (!auth) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const { roomNumber, toStudentCode, message } = await req.json();

  const rn = Number(roomNumber);
  if (!Number.isInteger(rn) || rn < 1 || rn > 12) {
    return NextResponse.json({ error: "BAD_ROOM" }, { status: 400 });
  }

  const toCode = String(toStudentCode || "").trim();
  const text = String(message || "").trim();
  if (!toCode || !text) return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });

  const from = await prisma.student.findUnique({
    where: { studentCode: auth.sc },
    select: { id: true },
  });

  const to = await prisma.student.findUnique({
    where: { studentCode: toCode },
    select: { id: true, roomNumber: true },
  });

  if (!from || !to) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  // กันส่งข้ามห้อง
  if (to.roomNumber !== rn) return NextResponse.json({ error: "ROOM_MISMATCH" }, { status: 400 });

  // กันส่งให้ตัวเอง
  if (from.id === to.id) return NextResponse.json({ error: "CANT_SELF" }, { status: 400 });

  await prisma.roomFriendship.create({
    data: {
      roomNumber: rn,
      fromStudentId: from.id,
      toStudentId: to.id,
      message: text.slice(0, 280),
    },
  });

  return NextResponse.json({ success: true });
}

// ✅ ดูรายการ (ส่วนตัว: เจ้าตัวเท่านั้น)
export async function GET(req: Request) {
  const auth = await getAuth();
  if (!auth) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const url = new URL(req.url);
  const rn = Number(url.searchParams.get("roomNumber"));
  const toCode = String(url.searchParams.get("toStudentCode") || "").trim();

  if (!Number.isInteger(rn) || rn < 1 || rn > 12) return NextResponse.json({ error: "BAD_ROOM" }, { status: 400 });
  if (!toCode) return NextResponse.json({ error: "BAD_TARGET" }, { status: 400 });

  const to = await prisma.student.findUnique({
    where: { studentCode: toCode },
    select: { id: true, roomNumber: true },
  });
  if (!to) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  if (to.roomNumber !== rn) return NextResponse.json({ error: "ROOM_MISMATCH" }, { status: 400 });

  // 🔒 ดูได้เฉพาะเจ้าของ
  if (to.id !== auth.sid) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  const items = await prisma.roomFriendship.findMany({
    where: { roomNumber: rn, toStudentId: to.id, isDeleted: false },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      message: true,
      createdAt: true,
      fromStudentId: true,
      fromStudent: {
        select: { studentCode: true, prefix: true, firstName: true, lastName: true, profileImageUrl: true },
      },
    },
  });

  return NextResponse.json({
    items: items.map((x) => ({
      id: x.id,
      message: x.message,
      createdAt: x.createdAt,
      from: x.fromStudent,
      canDelete: x.fromStudentId === auth.sid,
    })),
  });
}

// ✅ ลบของตัวเอง (soft delete)
export async function DELETE(req: Request) {
  const auth = await getAuth();
  if (!auth) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });

  const row = await prisma.roomFriendship.findUnique({
    where: { id },
    select: { fromStudentId: true, isDeleted: true },
  });
  if (!row) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  if (row.isDeleted) return NextResponse.json({ success: true });

  if (row.fromStudentId !== auth.sid) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  await prisma.roomFriendship.update({
    where: { id },
    data: { isDeleted: true },
  });

  return NextResponse.json({ success: true });
}
