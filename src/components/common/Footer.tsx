import React from "react";
import qs from "query-string";
import { isEventCookieExists } from "@kookjs-client/uxm"
import FooterUxm from '../common/FooterUxm'

export default () => {	
	const qparam = qs.parse(window.location.search);
	const hideNav = qparam.hideNav ? true : false;
	const isEvent = isEventCookieExists()
	if(hideNav || isEvent) return null
	return (
		<FooterUxm />
	);
}