export default function Home() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">หน้าแรก</h1>
      <p className="text-gray-600">
        เลือกห้องเพื่อดูรายชื่อเพื่อน หรือไปบอร์ดเพื่อโพสต์ข้อความถึงทั้งรุ่นได้เลย
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <a className="rounded-2xl border p-4 hover:bg-gray-50" href="/rooms">
          <div className="font-semibold">เลือกห้อง</div>
          <div className="text-sm text-gray-600">ห้อง 1–12</div>
        </a>
        <a className="rounded-2xl border p-4 hover:bg-gray-50" href="/board">
          <div className="font-semibold">บอร์ด</div>
          <div className="text-sm text-gray-600">โพสต์ให้ทุกคนเห็น</div>
        </a>
      </div>
    </div>
  );
}
