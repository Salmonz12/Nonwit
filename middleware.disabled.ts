import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// noop middleware: ปล่อยผ่านทุก request (ชั่วคราวเพื่อแก้ login ให้สำเร็จ)
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [], // ไม่จับ path ใดๆ
};
