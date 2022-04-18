import React, { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router";
import classNames from "classnames";
import qs from 'query-string'
import dotObject from "@khanakiajs/dot-object";
import { useApolloClient, ApolloError, useQuery, useLazyQuery, useMutation, gql } from "@apollo/client";

import { getPlugin, KookErrorParser } from "@kookjs-client/core";
import Auth from "@kookjs-client/auth";

import { Loading } from "@kookjs-client/core/components/shared/Loading";
import ShowWrap from "@kookjs-client/core/components/shared/ShowWrap";

import { QUERY_CARTS_REST, MUTATION_CART_ADD_ITEM } from "./query";
import CartList from "./CartList";
import { Link } from "react-router-dom";

export default () => {
	const loadingEl = useRef<any>();
	const [items, setItems] = useState<any>([]);	
	const history = useHistory();
	const client = useApolloClient();
	const auth = getPlugin(Auth);

	const [loading, setLoading] = useState(true);	

	const fetchCarts = () => {
		loadingEl.current.show()
		client
			.query({
				query: QUERY_CARTS_REST,
				fetchPolicy: "network-only",
				variables: {
					input: {
						sessionId: auth.getClientSessionId(),
					},
				},
			})
			.then((response) => {
				// console.log(response)
				const data = dotObject.getArrayValue(response, ["data", "carts", "items"], []);
				// console.log(data);
				setItems(data);
			})
			.catch((err: ApolloError) => {
				const errorParser = new KookErrorParser(err);
				toastr.error(errorParser.message);
			})
			.finally(() => {
				loadingEl.current ? loadingEl.current.hide() : null;
				setLoading(false);
			});
	};

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

      
			// onUpdate();
      toastr.success("Cart updated.");
		} catch (err) {
			const errorParser = new KookErrorParser(err);
			toastr.error(errorParser.message);
		}

		loadingEl.current ? loadingEl.current.hide() : null;
	};


	// http://localhost:2103/carts?add_to_cart=15397
	const cartEffect = async () => {
		const query = qs.parse(window.location.search, {
			parseNumbers: true
		});
		const id: any = query.add_to_cart
		if(query.add_to_cart) {
			await updateCart((id), 1)
		}
		fetchCarts();
	}

	useEffect(() => {
		cartEffect()
	}, []);

	const handleOnCartUpdate = () => {
		fetchCarts();
	};

	// if (!item) return <Loading ref={loadingEl} />;

	// console.log("ITEMS", items)

	// items.map((item) => {
	// 	console.log(item)
	// })

	const isCartEmpty = items.length==0
	const className = classNames("Carts container", {"isEmpty": isCartEmpty});

	return (
		<div className={className}>
			<Loading ref={loadingEl} />

			<ShowWrap show={!isCartEmpty}>
				<div className="text-center mb-5">
					<h2>Your Cart</h2>
					<div>
						<Link to="/catalogue">Continue Shopping</Link>
					</div>
				</div>
			</ShowWrap>

			<ShowWrap show={isCartEmpty && !loading}>
					<div className="cartEmptyWrapper">
						<div>
							<h2>Your Cart</h2>
							<div className="mb-2">Your cart is currently empty.</div>
							<div>
								<Link to="/catalogue" className="btn btn-dark">Continue Shopping</Link>
							</div>
						</div>
					</div>
			</ShowWrap>

			{items.map((item, i) => {
				// console.log(item)
				return <CartList cart={item} index={i} key={i} onUpdate={handleOnCartUpdate} />
			})}
		</div>
	);
};
