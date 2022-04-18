import React, { lazy } from 'react';
import { injectable, inject } from "inversify";
// import { createStore } from 'redux'
// import { TRoute, routeStore } from './store'
import { getApp, getPlugin } from "@kookjs-client/core";
import Route from "@kookjs-client/route";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { uuid } from "@kookjs-client/util"
import qs from "query-string";
// import Login from "./components/Login";
// // import ChangePassword from "./components/ChangePassword";
// import ForgotPassword from "./components/ForgotPassword";
// import ResetPassword from "./components/ResetPassword";
// import Register from "./components/Register";

// import { QUERY_AUTH_VALIDATE } from './query'

const Login = lazy(() => import("./components/Login"));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/ResetPassword"));
const Register = lazy(() => import("./components/Register"));
const AuthCheck = lazy(() => import("./components/AuthCheck"));

// window.Cookies = Cookies

@injectable()
export default class Auth {
	// add(route: TRoute) {
	//   routeStore.routes.push(route)
	// }

	boot() {
		const route = getPlugin(Route);

		route.add({
			path: "/auth/register",
			exact: true,
			component: "Register",
			layoutCssClass: "center",
			layoutName:"generic",
			authenticate: "Public",
			title: "Register"
		}, Register);

		route.add({
			path: "/login",
			exact: true,
			component: "Login",
			layoutCssClass: "center",
			layoutName:"generic",
			authenticate: "Public",
			title: "Login"
		}, Login);

		route.add({
			path: "/auth/forgot_password",
			exact: true,
			component: "ForgotPassword",
			layoutCssClass: "center",
			layoutName:"generic",
			// authenticate: "Public",
			title: "Forgot Password"
		}, ForgotPassword);

		route.add({
			path: "/auth/reset_password",
			exact: true,
			component: "ResetPassword",
			layoutCssClass: "center",
			layoutName:"generic",
			// authenticate: "Public",
			title: "Reset Password"
		}, ResetPassword);
		// console.log('Auth Boot')

		route.add({
			path: "/auth/check",
			exact: true,
			component: "Auth Check",
			layoutCssClass: "center",
			layoutName:"generic",
			// authenticate: "Public",
			title: "Auth Check"
		}, AuthCheck);
	}

	getToken(): string {
		return Cookies.get("token");
	}

	login(token = null) {
		if (!token) return "Cannot Login";
		Cookies.set("token", token, {expires: 7});
	}

	getTokenDecoded(): any {
		var token = this.getToken();
		if (!token) return {};
		const decoded = jwtDecode(token);
		return decoded;
	}

	isTokenExpired(): boolean {
		const decoded = this.getTokenDecoded();
		if (!decoded) return true;
		if (Date.now() <= decoded.exp * 1000) {
			return false;
		} else {
			return true;
		}
	}

	getTokenExpirationDate() {
		const decoded = this.getTokenDecoded();
		if (!decoded) return null;
		return new Date(decoded.exp * 1000);
	}

	isUserLoggedIn(): boolean {
		if (this.getToken() && !this.isTokenExpired()) return true;
		return false;
	}

	logout() {
		Cookies.remove("token");
	}

	getUserID() {
		const data = this.getTokenDecoded();
		return data.sub;
	}

	getUserUID(): string {
		const data = this.getTokenDecoded();
		return data.sub;
	}

	getUserEmail(): string {
		const data = this.getTokenDecoded();
		return data.email;
	}

	getAuthorizationHeader() {
		return "Bearer " + this.getToken();
	}

	async validate() {
		try {
			const response = await axios({
				method: "get",
				url: APP_CONFIG.apiHost + "/p/auth/validate",
				withCredentials: true,
      });
      return true
		} catch (error) {
			if (error.response && error.response.status === 401) {
        toastr.error("Token is invalid.");
        this.logout();
			}
    }
    
    return false
	}


	getClientSessionId(): string {
		let sid = localStorage.getItem('sid')
		if(sid) return sid
		sid = uuid()
		this.setClientSessionId(sid)
		return sid
	}

	setClientSessionId(id) {
		localStorage.setItem('sid', id)
		return id
	}

	parseRedirectUrl(token: string, history: any) {
		const qparam = qs.parse(window.location.search);
		let redirectUrl = qparam.redirect ? qparam.redirect.toString() : "/";
		const isClientSide = redirectUrl.indexOf("http") !==-1 ? false : true
		if(isClientSide) {
			history.push(redirectUrl);
			return
		}

		console.log(qs.parseUrl(redirectUrl))
		let parsedRedirect = qs.parseUrl(redirectUrl)
		if(qparam.st=="t") {
			parsedRedirect.query['token'] = token
		}

		redirectUrl = qs.stringifyUrl(parsedRedirect)
		// console.log(redirectUrl)

		// let win: any = window
		// if(self!=top) {
		// 	win = window.parent
		// }
		window.location.href = redirectUrl // Login via UXM func
	}
}