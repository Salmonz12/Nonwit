import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const { studentCode, password } = await req.json();

    if (!studentCode || !password) {
      return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });
    }

    const sc = String(studentCode).trim();

    const student = await prisma.student.findUnique({
      where: { studentCode: sc },
      select: {
        id: true,
        studentCode: true,
        passwordHash: true,
        hasPassword: true,
        role: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 401 });
    }

    if (!student.hasPassword || !student.passwordHash) {
      return NextResponse.json({ error: "NO_PASSWORD" }, { status: 401 });
    }

    const ok = await bcrypt.compare(String(password), student.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "WRONG_PASSWORD" }, { status: 401 });
    }

    const token = await signSession({
      sid: student.id,
      sc: student.studentCode,
      role: student.role,
    });

    const res = NextResponse.json({ success: true });
    res.cookies.set("session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
