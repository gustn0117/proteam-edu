import { cookies } from "next/headers";
import db from "./db";

export interface User {
  id: string;
  email: string;
  name: string;
  organization: string;
  department: string;
  patent_no: string;
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
      "SELECT id, email, name, organization, department, patent_no, phone, role, newsletter FROM users WHERE id = ?"
    )
    .get(sessionId) as User | undefined;

  return user || null;
}

export async function getAdminUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("admin_session_id")?.value;
  if (!sessionId) return null;

  const user = db
    .prepare(
      "SELECT id, email, name, organization, department, patent_no, phone, role, newsletter FROM users WHERE id = ? AND role = 'admin'"
    )
    .get(sessionId) as User | undefined;

  return user || null;
}
