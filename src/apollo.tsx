import { RestLink } from "apollo-link-rest";
import { from, ApolloClient, HttpLink, ApolloProvider, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { grecaptchaExecute } from "@kookjs-client/util";
import { getAppConfig } from "./contants";
import { getApp, getPlugin } from "@kookjs-client/core";
import Auth from '@kookjs-client/auth'


const cache = new InMemoryCache({});

// Apollo was not sending 404 error - https://github.com/apollographql/apollo-link-rest/issues/150
async function customFetch(requestInfo, init) {
	const response = await fetch(requestInfo, init);
	if (response.status === 404) {
		throw new Error("404 not found");
	}
	return response;
}

const errorLink = onError(({ forward, operation, response, graphQLErrors, networkError }) => {
	// if (graphQLErrors)
	//   graphQLErrors.map(({ message, locations, path }) =>
	//     console.log(
	//       `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
	//     )
	//   );
	if (networkError) console.log(`[Network error]: ${networkError}`);

	// console.log(response.errors)
	// console.log(response.data)
	// return forward(operation)
});

const recaptchaLink = setContext((operation, data) => {
	// console.log(operation)
	if (
		[
			"Register",
			"AuthLogin",
			"AuthChangePassword",
			"AuthForgotPassword",
			"AuthPasswordReset",
			'RegisterByEmail',
			'SendToFriend',
			'ItemEnquiry',
			'CheckEmailExists'

		].indexOf(operation.operationName) == -1
	)
		return;
	return grecaptchaExecute().then((token) => {
		return {
			// Make sure to actually set the headers here
			headers: {
				"x-captcha-res": token || null,
			},
		};
	});
});

const setAuthTokenCtx = setContext((operation, previousContext) => { 
  const { headers, canHazPancakes } = previousContext
  // if (!canHazPancakes) { 
  //   return previousContext
  // }

	const auth = getPlugin(Auth)

	// console.log(previousContext)

  return {
    ...previousContext,
    headers: {    
      ...headers,
      "x-auth-token": auth.getToken()
    }
  }
})

const appConfig = getAppConfig();

const restLink = new RestLink({
	uri: appConfig.apiHost,
	credentials: "include",
	customFetch: (requestInfo, init) => customFetch(requestInfo, init),
});

export const apolloClient = new ApolloClient({
	cache: cache,
	link: from([recaptchaLink, setAuthTokenCtx, errorLink, restLink]),
	defaultOptions: {
		watchQuery: {
			errorPolicy: "all",
		},
	},
});