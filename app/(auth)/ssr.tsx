// src/graphql/amplifySSR.ts
import { withSSRContext } from "aws-amplify"
import { cookies } from "next/headers"
import { config } from "./config"

const serialize = (c: any) => {
  const attrs = [
    "path" in c && c.path && `Path=${c.path}`,
    "expires" in c && c.expires && `Expires=${c.expires.toUTCString()}`,
    "maxAge" in c && c.maxAge && `Max-Age=${c.maxAge}`,
    "domain" in c && c.domain && `Domain=${c.domain}`,
    "secure" in c && c.secure && "Secure",
    "httpOnly" in c && c.httpOnly && "HttpOnly",
    "sameSite" in c && c.sameSite && `SameSite=${c.sameSite}`,
  ].filter(Boolean)

  return `${c.name}=${c.value ? decodeURIComponent(c.value) : ""}; ${
    attrs.join("; ") + (attrs.length > 0 ? "; " : "")
  }`
}

const serializeMultiple = (cookies: any[]) => {
  return cookies.map(serialize).join("")
}

export const getWithSSRContext = () => {
  const cookieStore = cookies()
  const SSR = withSSRContext({
    req: { headers: { cookie: serializeMultiple(cookieStore.getAll()) } },
  })
  SSR.configure(config)

  return SSR
}
