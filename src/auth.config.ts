import type { NextAuthConfig } from "next-auth";

const PROTECTED_PATHS = ["/dashboard", "/manage", "/chat", "/subscription"]

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // authはユーザーセッションが含まれる
      const isLoggedIn = !!auth?.user; // ユーザーがログインしているか
      const isProtedRoute = PROTECTED_PATHS.some(prefix => 
        nextUrl.pathname.startsWith(prefix)
      )
      if (isProtedRoute) {
        if (isLoggedIn) return true;
        return Response.redirect(new URL("/login", nextUrl));
      } else if (isLoggedIn && nextUrl.pathname === "/login") {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  providers: [], // ログインオプション auth/index.ts側で設定
} satisfies NextAuthConfig;
