import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic"; // ✅ กัน prerender/CSR bailout พังตอน build

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">เข้าสู่ระบบ</h1>

        <Suspense fallback={<div className="mt-6 text-sm text-black/60">กำลังโหลด...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
