import React, { Suspense, lazy, useEffect } from 'react';
import { Route as ReactRoute, Switch, Redirect } from "react-router-dom";
import { Link, useHistory } from "react-router-dom";
import * as mobx from "mobx";
import qs from 'query-string'
import { sortBy } from "@kookjs-client/util"
import { setEventCookie, deleteEventCookie, isEventCookieParentTab } from "@kookjs-client/uxm"
import { getGlobalVariable, getPlugin } from "@kookjs-client/core";
import Auth from '@kookjs-client/auth'
import Route from "@kookjs-client/route";
import { routeStore } from "@kookjs-client/route/store";
import NoMatch from "./components/common/NoMatch";
import LayoutContainer from "./LayoutContainer";
import {Loading, LoadingElement} from "@kookjs-client/core/components/shared/Loading";

const App = () => {
	const auth = getPlugin(Auth)
	let routes = sortBy(mobx.toJS(routeStore.routes), ["priority"]);
	const routePlugin = getPlugin(Route);
	// console.log(routePlugin.Components)
	const history = useHistory();

	useEffect(() => {
		// If this is the first tab in the browser only then clear the event cookie
		if(isEventCookieParentTab()) {
			// alert("parent")
			
			window.onbeforeunload = function (event) {
				document.getElementsByTagName("body")[0].style.display = "none";
				deleteEventCookie()	
			};
		}

		// Set cookie after the event cookie parent tab otherwise parentTab condition will never satisfy
		setEventCookie()
	}, [])

	
	return (
		<Suspense fallback={<Loading show={true}/>} >
			<Switch>
				{routes.map((route, i) => {
					const { path, exact, component, layoutCssClass } = route;
					return (
						<ReactRoute
							key={location.pathname}
							path={path}
							exact={exact}
							render={(props) => {
								
								if ( route.authenticate == "Private" && auth.isUserLoggedIn() == false ) {
									const url = "/login?redirect=" + encodeURIComponent(location.pathname + location.search);
									

									return <Redirect to={url} />;
								}
	
								if (route.authenticate == "Public" && auth.isUserLoggedIn()) {
									auth.parseRedirectUrl(auth.getToken(), history)
									
									return null
									// const qparam = qs.parse(window.location.search);
									// const url = qparam.redirect ? qparam.redirect.toString() : "/";
									// return <Redirect to={url} />;
								}

								return (
									<LayoutContainer
										ChildComponent={routePlugin.Components[component]}
										authenticate={route.authenticate}
										roles={route.roles}
										capabilites={route.capabilites}
										title={route.title}
										layoutName={route.layoutName}
										layoutProps={{
											className: layoutCssClass,
										}}
									/>
								);
							}}
						/>
					);
				})}
				<ReactRoute render={(props) => <NoMatch />} />
			</Switch>
		</Suspense>
	);
};

export default App;