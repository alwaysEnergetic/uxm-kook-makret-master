import React, { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router";
import dotObject from "@khanakiajs/dot-object";
import { Helmet } from "react-helmet";
import { useApolloClient, ApolloError, useQuery, useLazyQuery, useMutation, gql } from "@apollo/client";

import { getPlugin, KookErrorParser } from "@kookjs-client/core";
import Auth from "@kookjs-client/auth";

import { Loading } from "@kookjs-client/core/components/shared/Loading";
import ErrorLabel from "@kookjs-client/core/components/shared/ErrorLabel";

import { MUTATION_CHECKOUT_SET_STEP } from "./query"

export default (props: { stepCompleted: any, onUpdate?: Function}) => {
  const { stepCompleted, onUpdate } = props
	const loadingEl = useRef<any>();
	const [cart, setCart] = useState<any>({});
	let { cartId } = useParams<any>();
	const history = useHistory();
	const client = useApolloClient();
  const auth = getPlugin(Auth);
  

  const breadCrumbs = [
    {
      title: "Cart",
      onClick: () => {
        history.push('/carts')
      },
      stepCompleted: 0
    },
    {
      title: "Information",
      onClick: () => {
        setStepCompleted(0)
      },
      stepCompleted: 1
    },
    {
      title: "Shipping",
      onClick: () => {
        setStepCompleted(1)
      },
      stepCompleted: 2
    },
    {
      title: "Payment",
      onClick: () => {
        setStepCompleted(2)
      },
      stepCompleted: 3
    }
  ]


	const setStepCompleted = async (stepCompleted: number) => {
    // data.countryId = country
    // console.log(data)
    // return

    loadingEl.current.show();
    let data = {
      cartId,
      sessionId : auth.getClientSessionId(),
      stepCompleted
    }
    
		client
			.mutate({
				mutation: MUTATION_CHECKOUT_SET_STEP,
				variables: {
					input: data,
				},
			})
			.then((res) => {
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

	return (
		<div className="CheckoutBreadCrumb">
      <Loading ref={loadingEl} overlay />
      {breadCrumbs.map((item, i) => {
        const active = parseInt(stepCompleted)>=item.stepCompleted ? true : false
        // console.log(parseInt(stepCompleted))
        return (
          <div key={i} className="kcol">
            {active ?
              <button className="btn btn-link btn-sm" onClick={item.onClick}>{item.title}</button>
              : 
              <span className="label">{item.title}</span>
            }
          </div>
        )
      })}
		</div>
	);
}