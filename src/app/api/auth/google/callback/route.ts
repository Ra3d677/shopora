import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    if (!code) return NextResponse.redirect(new URL("/auth/login?error=no_code", req.url));

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return NextResponse.redirect(new URL("/auth/login?error=oauth_not_configured", req.url));
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokens.access_token) {
      return NextResponse.redirect(new URL("/auth/login?error=token_exchange_failed", req.url));
    }

    // Get user info from Google
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const googleUser = await userRes.json();
    if (!googleUser.email) {
      return NextResponse.redirect(new URL("/auth/login?error=no_email", req.url));
    }

    // Find existing user by googleId or email
    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId: googleUser.id }, { email: googleUser.email }] },
    });

    if (user) {
      // Link googleId if not already set
      if (!user.googleId) {
        await prisma.user.update({
          where: { id: user.id },
          data: { googleId: googleUser.id, avatar: googleUser.picture || user.avatar },
        });
      }
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name || googleUser.email.split("@")[0],
          googleId: googleUser.id,
          avatar: googleUser.picture,
          emailVerified: true,
        },
      });
    }

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("userId", user.id, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
    });

    // Redirect to user's store admin
    const userStore = await prisma.store.findFirst({
      where: { ownerId: user.id },
      select: { slug: true },
    });
    const redirect = userStore
      ? `/store/${userStore.slug}/admin/dashboard`
      : user.email === "ksh128395@gmail.com"
      ? "/admin/stores/requests"
      : "/auth/login?error=no_store";

    return NextResponse.redirect(new URL(redirect, req.url));
  } catch (err: any) {
    console.error("Google OAuth callback error:", err);
    return NextResponse.redirect(new URL("/auth/login?error=unknown", req.url));
  }
}
