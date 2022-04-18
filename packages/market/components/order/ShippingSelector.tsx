import React, { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router";
import dotObject from "@khanakiajs/dot-object";
import { Helmet } from "react-helmet";
import { useApolloClient, ApolloError, useQuery, useLazyQuery, useMutation, gql } from "@apollo/client";

import { getPlugin, KookErrorParser } from "@kookjs-client/core";
import Auth from "@kookjs-client/auth";
import { formatMoneyWithSymbol } from "@kookjs-client/util";
import ShowWrap from "@kookjs-client/core/components/shared/ShowWrap";

import { Loading } from "@kookjs-client/core/components/shared/Loading";
import { QUERY_CARTS_SHIPPING_METHODS_REST, MUTATION_CART_SAVE_SHIPPING } from "./query";
export default (props: {cartId: any, selectedId: any, onUpdate?: Function}) => {
	const { cartId, selectedId, onUpdate } = props;
	
	// const [rateId, setRateId] = useState(selectedId);
	const [rate, setRate] = useState<any>({
		virtualId: selectedId
	});

	const loadingEl = useRef<any>();
	const [items, setItems] = useState<any>([]);
	const [hasError, setHasError] = useState(false)
	// let { cartId } = useParams<any>();
	// const history = useHistory();
	const client = useApolloClient();
  const auth = getPlugin(Auth);
  

  const fetchList = () => {
		loadingEl.current.show();
		client
			.query({
				query: QUERY_CARTS_SHIPPING_METHODS_REST,
				fetchPolicy: "network-only",
        variables: {
          input: {
						cartId: (cartId),
						sessionId: auth.getClientSessionId(),
					}
        }
			})
			.then((response) => {
				// console.log(response)
				const data = dotObject.getArrayValue(response, ["data", "cartShippingMethods", "items"], []);
				// console.log(data)
				if(data && data.length > 0) {
					setItems(data);
					setHasError(false)
				} else {
					setHasError(true)
				}
			})
			.catch((err: ApolloError) => {
				// const errorParser = new KookErrorParser(err);
				// toastr.error(errorParser.message);
				setHasError(true)
			})
			.finally(() => {
				loadingEl.current ? loadingEl.current.hide() : null;
			});
  };
  
  const setShipping = (id) => {
    loadingEl.current.show();
		// console.log(rate)
		client
			.mutate({
				mutation: MUTATION_CART_SAVE_SHIPPING,
				variables: {
					input: {
            cartId: (cartId),
            sessionId: auth.getClientSessionId(),
						// shippingRateId: rateId
						shippingRateId: rate.id,
						shippingRateVirtualId: rate.virtualId
          },
				},
			})
			.then((res) => {
        // toastr.success("Shipping Updated to cart.");
        if (typeof onUpdate == "function") {
          onUpdate()
        }
			})
			.catch((err: ApolloError) => {
				const errorParser = new KookErrorParser(err);
				toastr.error(errorParser.message);
			})
			.finally(() => {
				loadingEl.current ? loadingEl.current.hide() : null;
			});
  }

	useEffect(() => {
		fetchList();
	}, []);

	useEffect(() => {
		if(!items || items.length==0) return;
		// console.log("items", items)
		const rate = items.find((item) => {
			// console.log(item)
			// console.log("selectedId", typeof(selectedId))
			return item.virtualId == selectedId
		})

		if(rate) setRate(rate)
		// console.log("rate", rate)
	}, [selectedId, JSON.stringify(items)]);

	return (
		<div className="ShippingSelector">
      <Loading ref={loadingEl} overlay />
			<ShowWrap show={hasError}>
					<div className="alert alert-danger">
						No Shipping Method found for this country.
					</div>
			</ShowWrap>
			<ShowWrap show={!hasError}>
				<h3>Select Shipping</h3>

				<ul className="list-group hasRadio mb-3">
						{items.map((item, i) => {

							// const checked = item.id==rateId
							// console.log(item, rate)
							const checked = item.virtualId==rate.virtualId
							// console.log("item.id==selectedId", item.id==selectedId, selectedId, item.id)
							return (
								<li className="list-group-item" key={i}>
									<label>
										<input type="radio"  checked={checked} onChange={() => setRate(item)} />
										{/* <span className="ms-2">{item.name} - {formatMoneyWithSymbol(item.price)}</span> */}
										<span className="ms-2">{item.displayTitle} = {formatMoneyWithSymbol(item.price)}</span>
										
									</label>
								</li>
							)
						})}

					</ul>
					
				<div className="text-end">
					<button className="btn btn-primary" onClick={setShipping}>Use This Shipping Method</button>
				</div>
			</ShowWrap>
		</div>
	);
}