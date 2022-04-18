import React, { Fragment, useState, useRef, useEffect } from "react";
import classNames from "classnames";
import dotObject from "@khanakiajs/dot-object";
import { useApolloClient, ApolloError, useQuery, useLazyQuery, useMutation, gql } from "@apollo/client";
import { getGlobalVariable, KookErrorParser } from "@kookjs-client/core";
import { getPlugin } from "@kookjs-client/core";
import Auth from "@kookjs-client/auth";
import { Loading } from "@kookjs-client/core/components/shared/Loading";
import { txTypeHasCart } from "../function";
import { Status } from "../constant";
import { MUTATION_CART_ADD_ITEM } from "../../order/query";

export default (props) => {
	const { qty, statusId, txType, itemId, className } = props;
	const isTypeCart = txTypeHasCart(txType);

	// Hide the button itself if cart is not ON UXM
	if (!isTypeCart) return null;

	if (statusId !== Status.PUBLISHED || qty<1) return (
		<div>
			<button disabled className="btn btn-sm btn-danger btn-block">
				Sold Out
			</button>
		</div>
	);

	const loadingEl = useRef<any>();
	const client = useApolloClient();
	const auth = getPlugin(Auth);
	const className_ = classNames(className);

	const handleClick = async () => {
		try {
			loadingEl.current.show()
			const res = await client.mutate({
				mutation: MUTATION_CART_ADD_ITEM,
				variables: {
					input: {
						itemId: itemId,
						sessionId: auth.getClientSessionId(),
						qty: 1
					},
				},
			});

			// console.log(res);

			const message = dotObject.getArrayValue(res, ["data", "cart_add_item", "message"], "Item added to cart.");
			toastr.success(message)
			// console.log(userId);
		} catch (err) {
			const errorParser = new KookErrorParser(err);
			toastr.error(errorParser.message);
			
		}

		loadingEl.current ? loadingEl.current.hide() : null;
	};

	return (
		<Fragment>
			<Loading ref={loadingEl} />
			<div className={className_}>
				<button className="btn btn-sm btn-primary btn-block" onClick={handleClick}>
				<i className="fal fa-cart-plus me-1"></i>Add To Cart
				</button>
			</div>
		</Fragment>
	);
};
