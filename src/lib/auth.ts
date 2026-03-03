import { cookies } from "next/headers";
import db from "./db";

export interface User {
  id: string;
  email: string;
  name: string;
  organization: string;
  phone: string;
  role: string;
  newsletter: number;
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;
  if (!sessionId) return null;

  const user = db
    .prepare(
      "SELECT id, email, name, organization, phone, role, newsletter FROM users WHERE id = ?"
    )
    .get(sessionId) as User | undefined;

  return user || null;
}
