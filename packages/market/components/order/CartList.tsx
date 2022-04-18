import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import dotObject from "@khanakiajs/dot-object";

import { Helmet } from "react-helmet";
import { useApolloClient, ApolloError, useQuery, useLazyQuery, useMutation, gql } from "@apollo/client";

import { getPlugin, KookErrorParser } from "@kookjs-client/core";
import Auth from "@kookjs-client/auth";
import { MUTATION_CART_ADD_ITEM, MUTATION_CART_REMOVE_ITEM } from "./query";
import { formatMoneyWithSymbol } from "@kookjs-client/util";
import Image from "@kookjs-client/core/components/shared/Image";
import { Loading } from "@kookjs-client/core/components/shared/Loading";

function rangeMap(num):Array<number> {
	return [...Array(num)].map((_, i) => i+1);
}

export default (props: { cart: any; index: number; onUpdate?: Function }) => {
	const { cart, index, onUpdate } = props;
	const loadingEl = useRef<any>();
	const client = useApolloClient();
	const auth = getPlugin(Auth);

	// if (!item) return <Loading ref={loadingEl} />;

	const updateCart = async (itemId: number, qty: number) => {
		try {
      loadingEl.current.show()
			const res = await client.mutate({
				mutation: MUTATION_CART_ADD_ITEM,
				variables: {
					input: {
						itemId: itemId,
						sessionId: auth.getClientSessionId(),
						qty: qty,
					},
				},
			});

      
			onUpdate();
      toastr.success("Cart updated.");
		} catch (err) {
			const errorParser = new KookErrorParser(err);
			toastr.error(errorParser.message);
		}

		loadingEl.current ? loadingEl.current.hide() : null;
	};

	const removeItemFromCart = async (itemId: number, qty: number) => {
		try {
      loadingEl.current.show()
			const res = await client.mutate({
				mutation: MUTATION_CART_REMOVE_ITEM,
				variables: {
					input: {
						itemId: itemId,
						sessionId: auth.getClientSessionId(),
						qty: qty,
					},
				},
			});

      
			onUpdate();
      toastr.success("Cart updated.");
		} catch (err) {
			const errorParser = new KookErrorParser(err);
			toastr.error(errorParser.message);
		}

		loadingEl.current ? loadingEl.current.hide() : null;
	};

	const handleQtyChange = async (e, itemId) => {
		// console.log(e.target.value)
		await updateCart(itemId, (e.target.value));
	};

	const handleRemoveItem = async (itemId) => {
		await removeItemFromCart(itemId, 0);
	};

	const cartItems = dotObject.getArrayValue(cart, ["cartItems"], []);
	// console.log(cart);
	if (cartItems.length == 0) {
		return null;
	}

	const subTotal = dotObject.get(cart, "totals.itemTotal", 0);

	return (
		<div className="CartList pb-6">
      <Loading ref={loadingEl} overlay />
			<h3 className="heading">Cart {index + 1}</h3>
			<div className="shopping-cart">
				<div className="row headingRow no-gutters">
					<div className="col">PRODUCT</div>
					<div className="col"></div>
					<div className="col">PRICE</div>
					<div className="col">QUANTITY</div>
					<div className="col">TOTAL</div>
				</div>
				{cartItems.map((item, i) => {
					// console.log(item)

					return (
						<div className="row itemRow no-gutters" key={item.id}>
							<div className="col product-image">
								<Image image={item.itemImageUrl} />
							</div>
							<div className="col product-details">
								<div className="product-title">
									<a href={item.itemUrl}>{item.itemName}</a>
									<div>
										<button className="remove-product btn btn-link" onClick={() => handleRemoveItem(item.itemId)}>
											Remove
										</button>
									</div>
								</div>
							</div>
							<div className="col product-price mt-2">{formatMoneyWithSymbol(item.price)}</div>
							<div className="col product-quantity">
								<select className="ms-1" defaultValue={item.qty} style={{ width: 65 }} onChange={(e) => handleQtyChange(e, item.itemId)}>
									{rangeMap(item.maximumOrderQty).map((item) => {
										return (
											<option key={item} value={item}>{item}</option>
										)
									})}
									{/* <option value="1">1</option>
									<option value="2">2</option>
									<option value="3">3</option>
									<option value="4">4</option>
									<option value="5">5</option> */}
								</select>
								<div style={{ flex: 1 }}></div>
							</div>

							<div className="col product-line-price mt-2">{formatMoneyWithSymbol(item.grandTotal)}</div>
						</div>
					);
				})}
				<div className="totals">
					<div className="totals-item">
						<label>Subtotal</label>
						<div className="totals-value" id="cart-subtotal">
							{formatMoneyWithSymbol(subTotal)}
						</div>
					</div>

					<div className="note">Taxes and shipping calculated at checkout</div>
				</div>

				<div className="text-end">
					<Link className="checkout btn btn-primary btn-sm mt-3" to={"/checkout/" + cart.id}>
						Checkout
					</Link>
				</div>
			</div>
		</div>
	);
};
