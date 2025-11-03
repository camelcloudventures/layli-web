import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Constants for redirect URLs
const REDIRECT_PATHS = {
  RESET_PASSWORD: "/auth/reset-password",
  ERROR_INVALID: "/auth/reset-password?error=invalid",
  ERROR_EXPIRED: "/auth/reset-password?error=expired",
  ERROR_UNEXPECTED: "/auth/reset-password?error=unexpected",
} as const;

interface AuthSession {
  access_token: string;
  refresh_token: string;
}

export async function GET(req: Request): Promise<NextResponse> {
  const requestUrl = new URL(req.url);
  const { searchParams } = requestUrl;
  const code = searchParams.get("code");
  const origin = requestUrl.origin;

  // Input validation
  if (!code || typeof code !== "string" || code.trim().length === 0) {
    return NextResponse.redirect(`${origin}${REDIRECT_PATHS.ERROR_INVALID}`);
  }

  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data?.session) {
      return NextResponse.redirect(`${origin}${REDIRECT_PATHS.ERROR_EXPIRED}`);
    }

    // Set tokens as HTTP-only cookies for security
    const { access_token, refresh_token }: AuthSession = data.session;

    const response = NextResponse.redirect(
      `${origin}${REDIRECT_PATHS.RESET_PASSWORD}`
    );

    // Set secure HTTP-only cookies
    response.cookies.set("sb-access-token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    response.cookies.set("sb-refresh-token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (err) {
    // Log error for monitoring (without exposing sensitive data)
    if (process.env.NODE_ENV === "development") {
      console.error("Auth callback error:", err);
    }

    return NextResponse.redirect(`${origin}${REDIRECT_PATHS.ERROR_UNEXPECTED}`);
  }
}
