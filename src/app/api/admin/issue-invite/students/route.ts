import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth-server";

export async function GET() {
  const auth = await getAuth();
  if (!auth || auth.role !== "ADMIN") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const students = await prisma.student.findMany({
    orderBy: [{ roomNumber: "asc" }, { studentCode: "asc" }],
    select: { studentCode: true, firstName: true, lastName: true, roomNumber: true, hasPassword: true },
  });

  return NextResponse.json({ students });
}
