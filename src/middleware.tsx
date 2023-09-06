import { withClerkMiddleware } from '@clerk/nextjs';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ["/", "/sign-in*", "/sign-up*", "/api*"];

const isPublic = (path: string) => {
  return publicPaths.find((x) => {
    return path.match(new RegExp(`^${x}$`.replace("*$", "($|/)")))}
  );
};

export default withClerkMiddleware((request: NextRequest) => {
  const publicRoute = isPublic(request.nextUrl.pathname);
  console.log('[+] request.nextUrl.pathname: ', publicRoute);
  if (isPublic(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const { userId } = getAuth(request);

  if (!userId) {
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('redirect_url', request.url)
    return NextResponse.redirect(signInUrl)
  }
  return NextResponse.next();
});

export const config = { matcher: '/((?!_next/image|_next/static|favicon.ico).*)',};