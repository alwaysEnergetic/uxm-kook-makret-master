import React, { useEffect } from "react";
import qs from 'query-string'
import { getGlobalVariable,  getPlugin, KookErrorParser } from "@kookjs-client/core";
import Auth from "@kookjs-client/auth";
import { datalayerPush } from "@kookjs-client/util";
export default () => {
	
	const auth = getPlugin(Auth);

	useEffect(() => {
		const qparam = qs.parse(window.location.search);
		datalayerPush({
      'event':'checkout',
      'page': "orderSuccess", 
      'order': qparam.orderId,
      'userId': auth.getUserID()
    });
	}, [])

	return (
		<div className="OrderStatus container text-center">
			<i className="fa fa-check-circle iconSuccess"></i>
			<h1>Your order was successful!</h1>
			<div className="message">We will send you an invoice on your email shortly.</div>
		</div>
	);
}