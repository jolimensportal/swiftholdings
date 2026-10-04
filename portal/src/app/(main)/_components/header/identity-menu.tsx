import { cookies } from "next/headers";

import { getAdminOverview, getPortalData } from "@/server/swift-api";

/**
 * Real identity for the header. Replaces the template's AccountSwitcher, which
 * let anyone flip between two hardcoded demo users — meaningless here, since a
 * member's identity comes from their session and their tier from the database.
 */
export async function IdentityMenu() {
  const jar = await cookies();
  const token = jar.get("swift_auth")?.value;

  // Admins may not be members at all, so try the admin API first.
  const admin = await getAdminOverview();
  const portal = admin ? null : await getPortalData();

  if (!token) return null;

  const name = admin?.admin.name ?? portal?.member.name ?? "";
  const email = admin?.admin.email ?? portal?.member.email ?? "";
  const role = admin ? admin.admin.role : portal?.member.tier;

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-sm leading-tight text-foreground">{name}</p>
        <p className="text-xs leading-tight text-muted-foreground">{role}</p>
      </div>
      <form action="/api/logout" method="post">
        <button
          type="submit"
          className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}