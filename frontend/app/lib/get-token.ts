import Cookies from "js-cookie";
import { siteConfig } from "./site";

export function getToken() {
  if (typeof window !== "undefined") {
    return Cookies.get(siteConfig.cookieNames.session);
  }
  return null;
}

export function getUserId() {
  if (typeof window !== "undefined") {
    return Cookies.get(siteConfig.cookieNames.user);
  }
  return null;
}
