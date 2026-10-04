import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAdminSession } from "@/server/swift-api";

/**
 * Gates everything under (main)/admin. The parent (main) layout only proves a
 * session cookie exists; this additionally proves the session carries an admin
 * role, verified server-side against the marketing Worker's admin API.
 */
export default async function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  if (!(await isAdminSession())) redirect("/login");

  return <>{children}</>;
}