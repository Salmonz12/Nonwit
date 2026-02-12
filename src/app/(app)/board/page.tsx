export default function BoardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">บอร์ด</h1>
      <p className="mt-2 text-sm text-black/60">
        หน้านี้ไว้โพสต์ข้อความให้ทุกคนเห็น (เดี๋ยวทำระบบโพสต์/คอมเมนต์ต่อ)
      </p>

      <div className="mt-6 rounded-2xl border p-4 text-sm text-black/60">
        (ยังไม่เปิดใช้งาน) — ต่อไปจะทำ: สร้างโพสต์, ลบของตัวเอง, คอมเมนต์
      </div>
    </div>
  );
}
