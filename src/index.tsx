const style = require("./assets/scss/main.module.scss");

import "reflect-metadata";
import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Route as ReactRoute } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { QueryParamProvider } from "use-query-params";
import axios from 'axios'
// import { LastLocationProvider } from 'react-router-last-location';
import { createApp, getPlugin } from "@kookjs-client/core";
import Route from "@kookjs-client/route";
import Auth from "@kookjs-client/auth";
import Seo from "@kookjs-client/seo";
import Market from "@kookjs-client/market";
import MobxStore, { MobxStoreContext } from "@kookjs-client/mobx-store";

import { apolloClient } from "./apollo"
// import { StoreContext, GlobalStore } from "./store/mobx"
import AppComp from "./App";


const app = createApp();

const main = async () => {
	app.registerPlugin(Route);
	app.registerPlugin(Auth);
	app.registerPlugin(MobxStore);
	app.registerPlugin(Seo);
	app.registerPlugin(Market);
	await app.boot();

	const mobxStore = app.getPlugin(MobxStore);

	const auth = app.getPlugin(Auth);
	// https://blog.bitsrc.io/setting-up-axios-interceptors-for-all-http-calls-in-an-application-71bc2c636e4e
	axios.interceptors.request.use(
		function(request) {
			if(auth.getToken()) {
				request.headers['x-auth-token'] = auth.getToken()
			}
			return request
			
		}, 
		function(error) {
			return Promise.reject(error);
		}
	);


	render(
		<ApolloProvider client={apolloClient}>
			<BrowserRouter>
				<QueryParamProvider ReactRouterRoute={ReactRoute}>
						<MobxStoreContext.Provider value={mobxStore}>
								<AppComp />
						</MobxStoreContext.Provider>
				</QueryParamProvider>
			</BrowserRouter>
		</ApolloProvider>,
		document.getElementById("root")
	);
};

main();
