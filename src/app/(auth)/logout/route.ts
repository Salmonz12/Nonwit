import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  const h = await headers();
  const host = h.get("host")!;
  const proto = h.get("x-forwarded-proto") ?? "http";

  const res = NextResponse.redirect(new URL("/enter-code", `${proto}://${host}`));
  res.cookies.set("session", "", { path: "/", maxAge: 0 });
  return res;
}
