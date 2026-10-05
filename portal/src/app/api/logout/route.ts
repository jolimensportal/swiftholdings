import { NextResponse } from "next/server";

/**
 * Clears the session cookie. It is scoped to `.swifthorizon.com.gh`, so the
 * Domain attribute must match exactly or the browser keeps the original.
 */
export async function POST() {
  // 303, not 307: a 307 preserves the method, so the browser would re-POST to
  // /login and the signed-out user would bounce between the two.
  const response = NextResponse.redirect(
    new URL("/login", process.env.NEXT_PUBLIC_APP_URL ?? "https://portal.swifthorizon.com.gh"),
    303,
  );

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