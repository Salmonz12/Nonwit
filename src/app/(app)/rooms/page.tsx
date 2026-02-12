import Link from "next/link";

export default function RoomsPage() {
  const rooms = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold">เลือกห้อง</h1>
      <p className="text-sm text-gray-500 mt-1">เลือกห้องเพื่อดูรายชื่อเพื่อน</p>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {rooms.map((n) => (
          <Link
            key={n}
            href={`/rooms/${n}`}
            className="rounded-2xl border p-4 hover:bg-black/5"
          >
            <div className="text-sm text-gray-500">ห้อง</div>
            <div className="text-xl font-semibold">{n}</div>
          </Link>
          
        ))}
        <Link href="/me" className="rounded-xl bg-black text-white px-4 py-2 hover:opacity-90">
  โปรไฟล์ฉัน
</Link>

      </div>
    </div>
  );
}
