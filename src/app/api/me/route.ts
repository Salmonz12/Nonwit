import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth-server";

export async function GET() {
  const auth = await getAuth();
  if (!auth) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const me = await prisma.student.findUnique({
    where: { id: auth.sid },
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
      role: true,
    },
  });

  if (!me) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json({ me });
}

export async function PATCH(req: Request) {
  const auth = await getAuth();
  if (!auth) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const body = await req.json();

  // อนุญาตแก้เฉพาะฟิลด์พวกนี้ (กันแอบแก้ role / room / studentCode)
  const data = {
    profileImageUrl: typeof body.profileImageUrl === "string" ? body.profileImageUrl.trim() : undefined,
    bio: typeof body.bio === "string" ? body.bio.trim().slice(0, 280) : undefined,
    contactFacebook: typeof body.contactFacebook === "string" ? body.contactFacebook.trim().slice(0, 120) : undefined,
    contactIg: typeof body.contactIg === "string" ? body.contactIg.trim().slice(0, 120) : undefined,
    contactLine: typeof body.contactLine === "string" ? body.contactLine.trim().slice(0, 120) : undefined,
  };

  // ลบ key ที่เป็น undefined ออก (กัน Prisma บ่น)
  Object.keys(data).forEach((k) => (data as any)[k] === undefined && delete (data as any)[k]);

  const updated = await prisma.student.update({
    where: { id: auth.sid },
    data,
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
      role: true,
    },
  });

  return NextResponse.json({ me: updated });
}
