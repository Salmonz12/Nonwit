import { Suspense } from "react";
import SetPasswordForm from "./SetPasswordForm";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">ตั้งรหัสผ่านครั้งแรก</h1>

        <Suspense fallback={<div className="mt-6 text-sm text-black/60">กำลังโหลด...</div>}>
          <SetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
