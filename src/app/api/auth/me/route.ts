import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";

export async function GET() {
  const token = (await cookies()).get("session")?.value;
  if (!token) return NextResponse.json({ hasSessionCookie: false });

  try {
    const payload = await verifySession(token);
    return NextResponse.json({ hasSessionCookie: true, payload });
  } catch (e: any) {
    return NextResponse.json({
      hasSessionCookie: true,
      verify: "FAILED",
      message: String(e?.message ?? e),
    });
  }
}
