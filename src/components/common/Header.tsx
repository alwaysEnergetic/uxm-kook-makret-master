import React from "react";
import qs from "query-string";
import { isEventCookieExists } from "@kookjs-client/uxm"
import HeaderUxm from '../common/HeaderUxm'
import HeaderEvent from '../common/HeaderEvent'

export default () => {	
	const qparam = qs.parse(window.location.search);
	const hideNav = qparam.hideNav ? true : false;
	if(hideNav) return null

	const isEvent = isEventCookieExists()
	return (
		<>
		 { isEvent ? <HeaderEvent /> : <HeaderUxm /> }
		</>
	);
}