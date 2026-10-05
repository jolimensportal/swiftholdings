import { NextResponse } from "next/server";

const API_ORIGIN =
  process.env.SWIFT_API_ORIGIN ?? "https://swifthorizon.com.gh";

/**
 * Signs the user in by exchanging credentials with the marketing Worker, which
 * owns the members table and is the only thing that can mint a valid session.
 *
 * The Set-Cookie has to be copied across verbatim — including Domain — because
 * the API issues it scoped to .swifthorizon.com.gh. The browser only stores it
 * for the portal if that Domain attribute survives the trip.
 */
export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  // The marketing Worker authenticates members and admins separately: an admin
  // account only succeeds when scope is "admin", and a member account only when
  // it is absent. Without this switch an admin login is rejected as invalid.
  const scope = String(form.get("scope") ?? "");

  const loginUrl = new URL("/login", request.url);

  if (!email || !password) {
    loginUrl.searchParams.set("error", "missing");
    return NextResponse.redirect(loginUrl);
  }

  try {
    const upstream = await fetch(`${API_ORIGIN}/api/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(
        scope === "admin" ? { email, password, scope: "admin" } : { email, password },
      ),
    });

    if (!upstream.ok) {
      loginUrl.searchParams.set("error", "invalid");
      return NextResponse.redirect(loginUrl);
    }

    const setCookie = upstream.headers.get("set-cookie");

    // Admins land on the operator console, members on their dashboard.
    const body = (await upstream.json()) as { admin?: unknown };
    const destination = new URL(
      body.admin ? "/admin/members" : "/dashboard/default",
      request.url,
    );

    const response = NextResponse.redirect(destination);
    if (setCookie) response.headers.append("set-cookie", setCookie);

    return response;
  } catch {
    loginUrl.searchParams.set("error", "unavailable");
    return NextResponse.redirect(loginUrl);
  }
}