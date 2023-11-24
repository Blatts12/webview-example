import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent");

  const response = NextResponse.next();
  if (userAgent) {
    const isWebview = userAgent?.startsWith("webview");
    const webview = isWebview ? userAgent?.substring(8) : null;
    if (webview) response.cookies.set("webview", webview);
  }

  return response;
}
