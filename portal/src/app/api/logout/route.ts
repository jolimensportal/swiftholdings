import { NextResponse } from "next/server";

/**
 * Clears the session cookie. It is scoped to `.swifthorizon.com.gh`, so the
 * Domain attribute must match exactly or the browser keeps the original.
 */
export async function POST() {
  const response = NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL ?? "https://portal.swifthorizon.com.gh"));

  response.cookies.set({
    name: "swift_auth",
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    domain: ".swifthorizon.com.gh",
    path: "/",
    maxAge: 0,
  });

  return response;
}