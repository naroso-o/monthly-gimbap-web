import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserForMiddleware } from "./utils/supabase/server";

export default async function middleware(req: NextRequest) {
  const user = await getCurrentUserForMiddleware(req);

  // 로그인이 필요한 페이지에서 사용자가 없는 경우
  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 이미 로그인한 사용자가 login, signup 페이지에 접근하는 경우 홈으로 리다이렉트
  const { pathname } = req.nextUrl;
  if (user && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', req.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     * - signup (signup page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|signup).*)',
  ],
}