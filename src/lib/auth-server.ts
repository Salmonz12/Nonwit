import "server-only";
import { cookies } from "next/headers";
import { verifySession } from "./session";

export async function getAuth() {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;
  return await verifySession(token);
}
