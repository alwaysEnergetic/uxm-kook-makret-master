import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
const qs = require("query-string");

import { TxType } from "../constant";
import ShowWrap from "@kookjs-client/core/components/shared/ShowWrap";
var classNames = require("classnames");

import { getPlugin } from "@kookjs-client/core";
import Auth from "@kookjs-client/auth";
import dotObject from "@khanakiajs/dot-object";
import { parseTemplate } from "@kookjs-client/util";
import { useApolloClient, ApolloError, useQuery, useLazyQuery, useMutation, gql } from "@apollo/client";
import { getGlobalVariable, KookErrorParser } from "@kookjs-client/core";

import { MUTATION_REGISTER_BYEMAIL } from "../query";
import { Status } from "../constant"

function getAffliateUrl(args: any = {}) {
	try {
		let url = args.redirectUrl;
		if (args.txType == TxType.AFFILIATE) {
			url = parseTemplate(url, {
				user_id: args.userId,
				item_id: args._id,
			});
		} else {
			// window.url1 = new URL(url)
			const url_ = new URL(url);
			url = url_.origin + url_.pathname;

			const vendorProductId = args.vendorProductId;
			const vrpdid = Array.isArray(vendorProductId) ? vendorProductId.join() : vendorProductId;
			// Build Params
			let params = {
				ref: "uxm",
				prdid: args._id,
				vprdid: vrpdid,
				coupon: args.couponCode,
				mid: args.userId,
			};

			let params_ = {
				...params,
				...qs.parse(url_.search),
			};

			let paramsString = qs.stringify(params_, {
				skipNull: true,
			});

			// Build Url
			url = `${url}?${paramsString}`;
		}

		return url;
	} catch (error) {
		console.log(error);
		return null;
	}
}

function BuyNowButton(props) {
	const { statusId, txType, redirectUrl, _id, vendorProductId, couponCode, className } = props;
	const showBuyNowBtn = [TxType.ON_SELLER_SITE, TxType.LEAD_ACTION, TxType.AFFILIATE].indexOf(txType) !== -1;
	// console.log(txType)

	const client = useApolloClient();

	if (statusId!==Status.PUBLISHED || !showBuyNowBtn) return null;

	const inputRef = useRef(null);

	const auth = getPlugin(Auth);

	const className_ = classNames("compBuyNowButton", className);

	const btnLabel = TxType.LEAD_ACTION == txType ? "Accept" : "Buy Now";

	const heading = TxType.LEAD_ACTION == txType ? null : "Click here to see all discount & bonus purchase options for this item.";

	const handleBuyNowClick = async () => {
		let userId = null;

		if (auth.isUserLoggedIn()) {
			userId = auth.getUserUID();
		} else {
			const email = inputRef.current.value;
			if (!email) {
				toastr.error("Please enter valid email.");
				return;
			}

			try {
				const res = await client.mutate({
					mutation: MUTATION_REGISTER_BYEMAIL,
					variables: {
						input: {
							email,
						},
					},
				});

				// console.log(res);

				userId = dotObject.getArrayValue(res, ["data", "register_byemail", "uid"], null);
				// console.log(userId);
			} catch (err) {
				const errorParser = new KookErrorParser(err);
				toastr.error(errorParser.message);
				return;
			}
		}

		if (!userId) {
			// console.log(userId);
			toastr.error("You need to login to buy.");
			return;
		}

		// console.log(redirectUrl);
		const url = getAffliateUrl({
			redirectUrl,
			_id,
			vendorProductId,
			couponCode,
			userId: userId,
			txType,
		});

		// console.log(userId)
		// console.log(url);
		window.location.href = url
	};

	return (
		<div className={className_}>
			<div className="card">
				<div className="card-body">
					{ heading ? <p className="card-text font-weight-bold">{heading}</p> : null }
					<ShowWrap show={!auth.isUserLoggedIn()}>
						<div className={"mt-3 mb-2"}>
							<input ref={inputRef} type="email" className={"form-control"} placeholder="Enter your email" />
						</div>
					</ShowWrap>
					<button className="btn btn-sm btn-gold btn-block btn-buynow1" onClick={handleBuyNowClick}>
						{btnLabel}
					</button>
				</div>
			</div>
		</div>
	);
}

export default BuyNowButton;