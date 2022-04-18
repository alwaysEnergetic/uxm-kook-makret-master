import qs from 'query-string'
import Cookies from "js-cookie";

export function setEventCookie() {
  const qparam = qs.parse(window.location.search);
  if(qparam.isEvent) {
		Cookies.set("isEvent", 'true');
	}
}

export function isEventCookieExists() : boolean {
  if (Cookies.get("isEvent")) return true
  return false
}

export function deleteEventCookie() {
  Cookies.remove("isEvent")
}

/**
 * We need to detech which tab is the first tab or initiated the cookie
 * So we can clear the event cookie only on that tab closing as we need to clear the cookie on session close
 * but session cookies was not getting cleared on browser close so i created some other workaround
 * @returns bool
 */
export function isEventCookieParentTab() : boolean {
  const qparam = qs.parse(window.location.search);
  if(qparam.isEvent && !isEventCookieExists()) return true
  // if(qparam.isEvent) return true
  return false
}