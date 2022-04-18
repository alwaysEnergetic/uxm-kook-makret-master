import React, { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router";
import dotObject from "@khanakiajs/dot-object";
import { Helmet } from "react-helmet";
import { useApolloClient, ApolloError, useQuery, useLazyQuery, useMutation, gql } from "@apollo/client";

import { getGlobalVariable,  getPlugin, KookErrorParser } from "@kookjs-client/core";
import Auth from "@kookjs-client/auth";
import { loadScript, LoadScriptProps, datalayerPush } from "@kookjs-client/util";
import { Loading } from "@kookjs-client/core/components/shared/Loading";
import { MUTATION_CART_VERIFY_PAYPAL_ORDER } from "./query";

export default (props: {cart: any, order: any}) => {
  const { cart, order } = props

  if( !order || !cart) return null

	const loadingEl = useRef<any>();
	// const [cart, setCart] = useState<any>({});
	// let { cartId } = useParams<any>();
	const history = useHistory();
	const client = useApolloClient();
  const auth = getPlugin(Auth);
  var globalVar = getGlobalVariable()

  let paymentIntent = "capture"
  if(cart.paymentIntent=="authorize") {
    paymentIntent = "authorize"
  }

  const verifyOrder = (response) => {
    
    datalayerPush({
      'event':'checkout',
      'page': "paypalVerifyOrder", 
      'order': order.id,
      'paypalOrderId': response.id,
      'userId': auth.getUserID()
    });
  

		loadingEl.current.show();
		client
			.mutate({
				mutation: MUTATION_CART_VERIFY_PAYPAL_ORDER,
				variables: {
					input: {
            orderId: (order.id),
            transactionJson: JSON.stringify(response),
            paypalOrderId: response.id
          },
				},
			})
			.then((response) => {
        // console.log(response)
        // const data = dotObject.getArrayValue(response, ["data", "cartCreateOrder"], {});
        history.push("/order/success?orderId="+order.id)
			})
			.catch((err: ApolloError) => {
				const errorParser = new KookErrorParser(err);
        toastr.error(errorParser.message);
        // window.location.reload();
        history.push("/order/failed?orderId="+order.id)
			})
			.finally(() => {
				loadingEl.current ? loadingEl.current.hide() : null;
			});
	}

  const createOrderFn = () => {
    datalayerPush({
      'event':'checkout',
      'page': "paypalCreateOrder", 
      'order': order.id,
      'userId': auth.getUserID()
    });
		
    globalVar.paypal.Buttons({
      createOrder: function(data, actions) {
        // This function sets up the details of the transaction, including the amount and line item details.
        return actions.order.create({
          intent: paymentIntent,
          
          payer: {
            name: {
              given_name: cart.shippingFirstName,
              surname: cart.shippingLastName,
            },
            address: {
              address_line_1: cart.shippingAddressLine1,
              address_line_2: cart.shippingAddressLine2,
              admin_area_2: cart.shippingCity,
              admin_area_1: cart.stateIso2,
              postal_code: cart.shippingZip,
              country_code: cart.countryIso2
            },
            // payer_id: auth.getUserUID(),
            email_address: auth.getUserEmail(),
            // phone: {
            //   phone_type: "MOBILE",
            //   phone_number: {
            //     national_number: "14082508100"
            //   }
            // }
          },
  
          purchase_units: [{
            invoice_id: order.uid,
            custom_id: auth.getUserID(),
            amount: {
              value: cart.totals.grandTotal
            },
            description: `Order with #${order.id} place by User #${auth.getUserUID()}`
          }],
  
          application_context: {
            shipping_preference: 'NO_SHIPPING'
          }
  
        });
      },
      onApprove: function(data, actions) {
        // This function captures the funds from the transaction.
        if(paymentIntent=="capture") {
          return actions.order.capture().then(function(details) {
            // This function shows a transaction success message to your buyer.
            // console.log(details)
            verifyOrder(details)
            // alert('Transaction completed by ' + details.payer.name.given_name);
          });
        } else {
          return actions.order.authorize().then(function(details) {
            // This function shows a transaction success message to your buyer.
            // console.log(details)
            verifyOrder(details)
            // alert('Transaction completed by ' + details.payer.name.given_name);
          });
        }
      }
    }).render('#paypal-button-container');
  }
  
  useEffect(() => {
    loadingEl.current.show()
    const script: LoadScriptProps = {
      src: `https://www.paypal.com/sdk/js?client-id=${APP_CONFIG.paypalClientId}&intent=${paymentIntent}`,
      // src: `https://www.paypal.com/sdk/js?client-id=${APP_CONFIG.paypalClientId}`,
      callback: () => {
        // console.log("Loaded")
        createOrderFn()
        loadingEl.current ? loadingEl.current.hide() : null;
      }
    }
    loadScript(script)
  })


	return (
		<div>
      <Loading ref={loadingEl} overlay />
			<div id="paypal-button-container"></div>
		</div>
	);
}