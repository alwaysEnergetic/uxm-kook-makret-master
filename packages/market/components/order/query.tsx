import { gql } from '@apollo/client';

export const MUTATION_CART_ADD_ITEM = gql`
  mutation CartAddItem($input: Input!) {
    cart_add_item(input: $input) 
		@rest(
			path: "/m/cart/add_item"
			method: "POST"
		)
		{
			message
		}
  }
`;


export const MUTATION_CART_REMOVE_ITEM = gql`
  mutation cartRemoveItem($input: Input!) {
    cartRemoveItem(input: $input) 
		@rest(
			path: "/cart/remove_item"
			method: "POST"
		)
		{
			message
		}
  }
`;



export const MUTATION_CART_SAVE_ADDRESS = gql`
  mutation CartSaveAddress($input: Input!) {
    cartSaveAddress(input: $input) 
		@rest(
			path: "/cart/save_address"
			method: "POST"
		)
		{
			message
		}
  }
`;

export const MUTATION_CART_SAVE_PAYMENT_METHOD = gql`
  mutation CartSavePaymentMethod($input: Input!) {
    cartSavePaymentMethod(input: $input) 
		@rest(
			path: "/cart/save_payment_method"
			method: "POST"
		)
		{
			message
		}
  }
`;

export const MUTATION_CART_SAVE_SHIPPING = gql`
  mutation CartSaveShipping($input: Input!) {
    cartSaveShipping(input: $input) 
		@rest(
			path: "/cart/save_shipping"
			method: "POST"
		)
		{
			message
		}
  }
`;

export const MUTATION_CHECKOUT_SET_STEP = gql`
  mutation CheckoutSetStep($input: Input!) {
    checkoutSetStep(input: $input) 
		@rest(
			path: "/checkout/set_step"
			method: "POST"
		)
		{
			message
		}
  }
`;

export const MUTATION_CART_CREATE_ORDER = gql`
  mutation CartCreateOrder($input: Input!) {
    cartCreateOrder(input: $input) 
		@rest(
			path: "/m/cart/create_order"
			method: "POST"
		)
		{
			id
			uid
		}
  }
`;

export const MUTATION_CART_VERIFY_PAYPAL_ORDER = gql`
  mutation CartVerifyPaypalOrder($input: Input!) {
    cartVerifyPaypalOrder(input: $input) 
		@rest(
			path: "/cart/verify_paypal_order"
			method: "POST"
		)
		{
			message
		}
  }
`;


export const QUERY_CARTS_REST = gql`
	query Carts($input: QueryInput!) {
		carts: carts(input: $input)
			@rest(
				path: "/m/cart/listall"
				method: "POST" 				
			) {
     
				items {
					id
					subTotal
					tax
					shipping
					total
					discount
					grandTotal
					paymentMethodId
					shippingFirstName
					shippingLastName
					shippingAddressLine1
					shippingAddressLine2
					shippingCountryId
					shippingStateId
					shippingCity
					shippingZip
					cartItems {
						id
						cartId
						itemId
						qty
						price
						grandTotal
						itemName
						itemUrl
						itemImageUrl
						maximumOrderQty
					}
					totals {
						itemTotal
						shipping
						discount
						subTotal
						taxTotal
						grandTotal
					}
				}
      }
	}
`;


export const QUERY_CART_REST = gql`
	query Cart($input: QueryInput!) {
		cart: cart(input: $input)
			@rest(
				path: "/cart/view"
				method: "POST" 				
			) {
     
					id
					# subTotal
					# tax
					shipping
					# total
					discount
					# grandTotal
					paymentMethodId
					phone
					email
					shippingFirstName
					shippingLastName
					shippingAddressLine1
					shippingAddressLine2
					shippingCountryId
					shippingStateId
					shippingCity
					shippingZip
					stepCompleted
					shippingRateVirutalId
					shippingRateId
					shippingRateName
					shippingFullAddress
					paymentMethodName
					countryIso2
					stateIso2
					paymentIntent
					cartItems {
						id
						cartId
						itemId
						qty
						price
						grandTotal
						itemName
						itemUrl
						itemImageUrl
					}
					totals {
						itemTotal
						shipping
						discount
						subTotal
						taxTotal
						grandTotal
					}
      }
	}
`;



export const QUERY_CARTS_PAYMENT_METHODS_REST = gql`
	query CartPaymentMethods($input: QueryInput!) {
		cartPaymentMethods: cartPaymentMethods(input: $input)
			@rest(
				path: "/cart/payment_methods/list"
				method: "POST" 				
			) {
     
				items {
					id
					name
					type
				}
      }
	}
`;

export const QUERY_CARTS_SHIPPING_METHODS_REST = gql`
	query CartShippingMethods($input: QueryInput!) {
		cartShippingMethods: cartShippingMethods(input: $input)
			@rest(
				path: "/cart/shipping_methods/list"
				method: "POST" 				
			) {
     
				items {
					virtualId
					id
					name
					price
					type
					displayTitle
				}
      }
	}
`;