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
      'page': "orderFailed", 
      'order': qparam.orderId,
      'userId': auth.getUserID()
    });
	}, [])

	return (
		<div className="OrderStatus container text-center">
			<i className="fa fa-times-circle iconFailed"></i>
			<h1>Your order was failed!</h1>
		</div>
	);
}