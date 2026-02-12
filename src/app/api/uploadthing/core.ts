import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getAuth } from "@/lib/auth-server";

const f = createUploadthing();

export const ourFileRouter = {
  profileImage: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async () => {
      const auth = await getAuth();
      if (!auth) throw new Error("UNAUTHORIZED");
      return { sid: auth.sid, sc: auth.sc };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // metadata.sid, metadata.sc ใช้ได้ถ้าจะผูกกับ DB ภายหลัง
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
