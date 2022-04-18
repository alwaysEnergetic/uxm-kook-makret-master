import React, { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router";

import { Helmet } from "react-helmet";
import { useApolloClient, ApolloError, useQuery, useLazyQuery, useMutation, gql } from "@apollo/client";

import { getPlugin, KookErrorParser } from "@kookjs-client/core";
import Auth from "@kookjs-client/auth";
import { Loading } from "@kookjs-client/core/components/shared/Loading";
import ShowWrap from "@kookjs-client/core/components/shared/ShowWrap";
import LineBreak from "@kookjs-client/core/components/shared/LineBreak";

import { QUERY_CARTS_PAYMENT_METHODS_REST, MUTATION_CART_SAVE_PAYMENT_METHOD } from "./query";

import dotObject from "@khanakiajs/dot-object";

export default (props: {cartId: any, selectedId: any, onUpdate?: Function}) => {
  const { cartId, selectedId, onUpdate } = props;
	const loadingEl = useRef<any>();
	const [items, setItems] = useState<any>([]);
	const [paymentMethodId, setPaymentMethodId] = useState(selectedId);
	
	const history = useHistory();
  const client = useApolloClient();
  const auth = getPlugin(Auth);

	const fetchList = () => {
		client
			.query({
        query: QUERY_CARTS_PAYMENT_METHODS_REST,
        variables: {
          input: {}
        }
			})
			.then((response) => {
				// console.log(response)
				const data = dotObject.getArrayValue(response, ["data", "cartPaymentMethods", "items"], []);
				// console.log(data)
				setItems(data);
			})
			.catch((err: ApolloError) => {
				const errorParser = new KookErrorParser(err);
				toastr.error(errorParser.message);
			})
			.finally(() => {
				loadingEl.current ? loadingEl.current.hide() : null;
			});
  };
  
  const setPaymentMethod = () => {
    loadingEl.current.show();
		client
			.mutate({
				mutation: MUTATION_CART_SAVE_PAYMENT_METHOD,
				variables: {
					input: {
            cartId: (cartId),
            sessionId: auth.getClientSessionId(),
            paymentMethodId: paymentMethodId
          },
				},
			})
			.then((res) => {
        // toastr.success("Paymentd Updated to cart.");
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

	// useEffect(() => {
	// 	fetchList();
	// }, []);

	return (
    <React.Fragment>
      <Loading ref={loadingEl} overlay />
      <div className="PaymentMethodSelector">
        <ul className="list-group hasRadio mb-3">
          {items.map((item, i) => {

            const checked = item.id==paymentMethodId
            // console.log("item.id==selectedId", item.id==selectedId, selectedId, item.id)
            return (
              <li className="list-group-item" key={i}>
                <label>
                  <input type="radio"  checked={checked} onChange={() => setPaymentMethodId(item.id)} />
                  <span className="ms-2">{item.name}</span>
                </label>
              </li>
            )
          })}

        </ul>

				<div className="text-end">
        	<button className="btn btn-primary" onClick={setPaymentMethod}>Use This Payment Method</button>
      	</div>
      </div>
    </React.Fragment>
	);
}
