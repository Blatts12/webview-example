import { GetServerSidePropsContext, NextPageContext } from "next";
import { AppContext } from "next/app";
import { Cookies } from "react-cookie";
import cookie from "cookie";

export type CookieContext =
  | AppContext
  | GetServerSidePropsContext
  | NextPageContext
  | undefined;

export function createCookies(ctx: NextPageContext) {
  const cookies = new Cookies(ctx.req?.headers.cookie ?? "");
  cookies.addChangeListener((change) => {
    if (ctx.res?.headersSent) {
      return console.warn("Trying to set cookies but headers are already sent");
    }

    const cookieString = cookie.serialize(
      change.name,
      change.value ?? "",
      change.options
    );
    ctx.res?.setHeader("Set-Cookie", cookieString);
  });

  return cookies;
}

export function getCookies(ctx: CookieContext): Cookies {
  return ctx ? createCookies((ctx as AppContext).ctx ?? ctx) : new Cookies();
}
