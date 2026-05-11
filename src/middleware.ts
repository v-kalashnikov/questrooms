import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./lib/api/session";
import { verifySession } from "./lib/api/session";
import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "./i18nConfig";
import db from "./modules/db";

const protectedRoutes = ["/admin"];
const excludedRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isExcludedRoute = excludedRoutes.includes(path);

  const session = await verifySession();

  const updatedSession = await updateSession(request);

  if (isProtectedRoute) {
    if (!session) {
      i18nRouter(request, i18nConfig);
      return NextResponse.redirect(new URL("/sign-in", request.nextUrl));
    }
    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: Number(session.userId) },
    });
    if (!user || user.email !== "vl_kalashn1kov@proton.me") {
      i18nRouter(request, i18nConfig);
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }
  }

  if (isExcludedRoute && session) {
    i18nRouter(request, i18nConfig);
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return i18nRouter(request, i18nConfig);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$|.*\\.jpg$).*)",
  ],
};
