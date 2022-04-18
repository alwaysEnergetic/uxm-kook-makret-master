import React, { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router";
import dotObject from "@khanakiajs/dot-object";
import { Helmet } from "react-helmet";
import { useApolloClient, ApolloError, useQuery, useLazyQuery, useMutation, gql } from "@apollo/client";

import { getPlugin, KookErrorParser, getGlobalVariable } from "@kookjs-client/core";
import Auth from "@kookjs-client/auth";
import { formatMoneyWithSymbol, datalayerPush } from "@kookjs-client/util";
import { Loading } from "@kookjs-client/core/components/shared/Loading";
import ShowWrap from "@kookjs-client/core/components/shared/ShowWrap";
import Image from "@kookjs-client/core/components/shared/Image";
import LineBreak from "@kookjs-client/core/components/shared/LineBreak";
import { QUERY_CART_REST, MUTATION_CART_CREATE_ORDER } from "./query";
// import AddressSelector from "./AddressSelector";
import AddressForm from "./AddressForm";

import CheckoutBreadCrumb from "./CheckoutBreadCrumb";
import PaymentMethodSelector from "./PaymentMethodSelector";
import ShippingSelector from "./ShippingSelector";

import PaypalPayment from "./PaypalPayment";

export default () => {
	const loadingEl = useRef<any>();
	const [cart, setCart] = useState<any>({});
	const [showPaymentScreen, setShowPaymentScreen] = useState(false);
	const [order, setOrder] = useState(null);
	let { cartId } = useParams<any>();
	const history = useHistory();
	const client = useApolloClient();
	const auth = getPlugin(Auth);
	var globalVar = getGlobalVariable();

	const getCart = () => {
		if (!cartId) return null;

		loadingEl.current.show();
		client
			.query({
				query: QUERY_CART_REST,
				fetchPolicy: "network-only",
				variables: {
					input: {
						cartId: (cartId),
						sessionId: auth.getClientSessionId(),
					},
				},
			})
			.then((response) => {
				// console.log(response)
				const data = dotObject.getArrayValue(response, ["data", "cart"], {});
				// console.log(data)
				setCart(data);
			})
			.catch((err: ApolloError) => {
				// console.log(err);
				// const errorParser = new KookErrorParser(err);
				// toastr.error(errorParser.message);
				// history.push("/carts")
			})
			.finally(() => {
				loadingEl.current ? loadingEl.current.hide() : null;
			});
	};

	const createOrder = () => {
		loadingEl.current.show();
		client
			.mutate({
				mutation: MUTATION_CART_CREATE_ORDER,
				variables: {
					input: {
						cartId: (cartId),
						sessionId: auth.getClientSessionId(),
					},
				},
			})
			.then((response) => {
				// console.log(response)
				const order = dotObject.getArrayValue(response, ["data", "cartCreateOrder"], {});
				if (!order.id) {
					toastr.error("Server error.");
				} else {
					setOrder(order);
					setShowPaymentScreen(true);
				}
				// console.log(order)
				// setCart(data);
				
				datalayerPush({
					'event':'checkout',
					'page': "paynow", 
					'cartId': cartId,
					'orderId': order.id,
					'userId': auth.getUserID()
				});
			
			})
			.catch((err: ApolloError) => {
				const errorParser = new KookErrorParser(err);
				toastr.error(errorParser.message);
				
			})
			.finally(() => {
				loadingEl.current ? loadingEl.current.hide() : null;
			});
	};

	useEffect(() => {
		getCart();
	}, []);

	const onAddressFormUpdate = () => {
		getCart();
	};

	// console.log("cart step", cart.stepCompleted)

	const stepCompleted = dotObject.getArrayValue(cart, ["stepCompleted"], 0);

	useEffect(() => {
		if(dotObject.isEmpty(cart)) return

		let page = "shippingAddress"
		switch (stepCompleted) {
			case 1:
				page = 'shippingCarrier'
				break;
			case 2:
				page = 'paymentMethod'
				break;
			case 3:
				page = 'summary'
				break;
		
			default:
				break;
		}

		datalayerPush({
			'event':'checkout',
			// 'category': "checkout",
			'page': page, 
			'cartId': cartId,
			'userId': auth.getUserID()
			// 'email': `${email}`
		});
		
	}, [stepCompleted, JSON.stringify(cart)]);

	if (!cart.id) return <Loading ref={loadingEl} />;

	const cartItems = dotObject.get(cart, "cartItems", []);
	console.log(cart)

	return (
		<div className="ItemCheckout">
			<Loading ref={loadingEl} />
			<div className="wrap">
				<div className="cmain">
					<CheckoutBreadCrumb stepCompleted={stepCompleted} onUpdate={() => getCart()} />

					<ShowWrap show={stepCompleted == 0}>
						{/* <AddressSelector /> */}
						<h3>Shipping Address</h3>
						<AddressForm
							onUpdate={onAddressFormUpdate}
							cartId={cartId}
							address={{
								firstName: cart.shippingFirstName,
								lastName: cart.shippingLastName,
								addressLine1: cart.shippingAddressLine1,
								addressLine2: cart.shippingAddressLine2,
								countryId: cart.shippingCountryId,
								stateId: cart.shippingStateId,
								city: cart.shippingCity,
								zip: cart.shippingZip,
								phone: cart.phone,
								email: cart.email
							}}
						/>
					</ShowWrap>

					<ShowWrap show={stepCompleted == 1}>
						<ShippingSelector  cartId={cart.id} selectedId={cart.shippingRateVirutalId} onUpdate={() => getCart()} />
					</ShowWrap>

					<ShowWrap show={stepCompleted == 2}>
						<PaymentMethodSelector cartId={cart.id} selectedId={cart.paymentMethodId} onUpdate={() => getCart()} />
					</ShowWrap>

					<ShowWrap show={stepCompleted == 3}>
						<ul className="list-group summaryListGroup mb-4">
							<li className="list-group-item">
								<label>Ship to</label>
								<div className="title"><LineBreak text={cart.shippingFullAddress} /></div>
							</li>
							<li className="list-group-item">
								<label>Shipping Method</label>
								<div className="title">{cart.shippingRateName}</div>
							</li>
							<li className="list-group-item">
								<label>Payment Method</label>
								<div className="title">{cart.paymentMethodName}</div>
							</li>
						</ul>

						<ShowWrap show={!showPaymentScreen}>
							<div className="text-end">
								<button className="btn btn-primary" onClick={createOrder}>
									Pay Now
								</button>
							</div>
						</ShowWrap>
					</ShowWrap>

					<ShowWrap show={showPaymentScreen}>
						<div className="mt-3">
							<PaypalPayment cart={cart} order={order} />
						</div>
					</ShowWrap>
				</div>

				<div className="sidebar">
					<div className="cartItemWrapper">
						{cartItems.map((item, i) => {
							// console.log(item)
							return (
								<div className="cartItemsRow" key={i}>
									<div className="col1 image">
										<Image image={item.itemImageUrl} />
										<div className="qty">{item.qty}</div>
									</div>
									<div className="col1 title">
										<a href={item.itemUrl}>{item.itemName}</a>
									</div>
									<div className="col1 product-price">{formatMoneyWithSymbol(item.grandTotal)}</div>
								</div>
							);
						})}

						<div className="summary">
							<div className="srow">
								<div className="title">Item Total</div>
								<div className="price">{formatMoneyWithSymbol(cart?.totals?.itemTotal)}</div>
							</div>
							<div className="srow">
								<div className="title">Shipping</div>
								<div className="price">{formatMoneyWithSymbol(cart.shipping)}</div>
							</div>

							{ cart?.totals?.taxTotal > 0 ?
								<div className="srow">
									<div className="title">Tax</div>
									<div className="price">{formatMoneyWithSymbol(cart?.totals?.taxTotal)}</div>
								</div>
								: null
							}
							<div className="srow gtotal">
								<div className="title">Total</div>
								<div className="price">{formatMoneyWithSymbol(cart?.totals?.grandTotal)}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
