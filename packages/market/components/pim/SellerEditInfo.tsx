import React, { useState, useRef, useEffect, useReducer } from "react";

/*
 * Dated: 2020-01-14
 * TASK check file OnboardingSeqScreens.pptx
 * This block will show on Right Sidebar on Catalogue page to Sellers only
 * Seller will visit to this page via Email by clicking the preview email link we will be sending
 * in Welcome Email
 * Preview URL: http://localhost:6002/catalogue/?sellerId=5c36f68d61e0a6223f7973d2&preview=0.6847112521015322
 */

import { getPlugin } from '@kookjs-client/core'
import Auth from '@kookjs-client/auth'

const SellerEditInfo = props => { 
	const { total=0, totalHidden=0 } = props
	
	const totalPublished = total - totalHidden
	const auth = getPlugin(Auth)

	const token = auth.getToken();
	let href = auth.isUserLoggedIn()
		? `${APP_CONFIG.domainSeller}/login?redirect=/items&token=${token}`
		: null;

	return (
		<div className="blockInfo">
			<p>
				<strong>Search Preview</strong> showing {totalHidden||0} hidden items and {totalPublished||0} published items
			</p>
			<p>
				<strong>To Change</strong> item price, discount, description,
				visibility, or Optimization click the button below and select
				item(s) to change.
			</p>

			<p>
				<strong>
					UXM Optimization<sup>&trade;</sup>
				</strong>
				will generate sales and new customers risk-free.
			</p>

			<a
				target="_blank"
				href={href}
				className="btn btn-outline-primary btn-sm btn-block"
				style={{ fontSize: "13px" }}
			>
				Click to view or edit the item setups
			</a>
		</div>
	);
};

export default SellerEditInfo;
