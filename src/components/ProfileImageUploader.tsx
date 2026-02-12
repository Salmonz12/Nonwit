"use client";

import { UploadButton } from "@/lib/uploadthing";

export default function ProfileImageUploader({ onUploaded }: { onUploaded: (url: string) => void }) {
  return (
    <div className="mt-3">
      <UploadButton
        endpoint="profileImage"
        onClientUploadComplete={(res) => {
          const url = res?.[0]?.url;
          if (url) onUploaded(url);
        }}
        onUploadError={(error: Error) => alert("อัปโหลดไม่สำเร็จ: " + error.message)}
      />
    </div>
  );
}
