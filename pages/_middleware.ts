import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  if (
    req.cookies.lm_secret !== process.env.SECRET &&
    req.nextUrl.pathname === "/"
  ) {
    return NextResponse.redirect("/login");
  }
}
