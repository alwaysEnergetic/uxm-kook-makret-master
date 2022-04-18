import React, { useRef, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import qs from "query-string";
import dotObject from "@khanakiajs/dot-object";
import {
	useQuery,
	useLazyQuery,
	useMutation,
	gql,
	useApolloClient,
	ApolloError,
} from "@apollo/client";
import { KookErrorParser, getGlobalVariable } from "@kookjs-client/core";
import {
	Loading,
	LoadingElement,
} from "@kookjs-client/core/components/shared/Loading";
import ErrorLabel from "@kookjs-client/core/components/shared/ErrorLabel";

import { AUTH_LOGIN_REST } from "../query";
import toastr from "toastr";

import { getApp, getPlugin } from "@kookjs-client/core";
import Auth from "../";

// const query = gql`
//   query luke {
//     person @rest(method: "POST", path: "auth/login/") {
//       name
//     }
//   }
// `;

export default function Login(props) {
	const loadingEl = useRef<LoadingElement>();
	const history = useHistory();
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		getValues,
	} = useForm({
		defaultValues: {
			username: "",
			password: "",
		},
	});
	const client = useApolloClient();
	const auth = getPlugin(Auth);
	// getGlobalVariable().auth = auth

	// const [authLogin, { loading: mutateLoading, error: mutateError }] = useMutation(AUTH_LOGIN);

	const onSubmit_ = async (formData) => {
		// console.log(formData);

		loadingEl.current.show();
		client
			.mutate({
				mutation: AUTH_LOGIN_REST,
				variables: {
					input: {
						userName: formData.username,
						password: formData.password,
					},
				},
			})
			.then((res) => {
				// console.log(res.data)
				const token = dotObject.getArrayValue(res, ["data", "authLogin", "token"]);
				if(!token) {
					toastr.error("Cannot login.");
				}
				auth.login(token)

				// console.log(auth.isUserLoggedIn())
				if(auth.isUserLoggedIn()) {
          auth.parseRedirectUrl(token, history)
        }

				// const qparam = qs.parse(window.location.search);
				// let redirectUrl = qparam.redirect ? qparam.redirect.toString() : "/";
				// const isClientSide = redirectUrl.indexOf("http") !==-1 ? false : true
				// if(isClientSide) {
				// 	history.push(redirectUrl);
				// 	return
				// }

				// console.log(qs.parseUrl(redirectUrl))
				// let parsedRedirect = qs.parseUrl(redirectUrl)
				// if(qparam.st) {
				// 	parsedRedirect.query['token'] = token
				// }

				// redirectUrl = qs.stringifyUrl(parsedRedirect)
				// console.log(redirectUrl)
				// window.location.href = redirectUrl // Login via UXM func
			})
			.catch((err: ApolloError) => {
				const errorParser = new KookErrorParser(err);
				// console.log(err1.message)
				// console.log(err1.code)
				// console.log(err1.data)
				// console.log(err1.originalMessage)
				toastr.error(errorParser.message);
			})
			.finally(() => {
				// console.log('IFNNNN')
				loadingEl.current ? loadingEl.current.hide() : null;
			});
	};

	const loginViaQueryStringToken = async () => {
		try {
			const qparam = qs.parse(window.location.search);
			// console.log(qparam)
			const token = qparam.token;
			// console.log(token)
			if (token) {
				// await auth.validateToken(token)
				// console.log(meResult)
				auth.login(token);
				const validated = await auth.validate();
				if (validated) {
					auth.parseRedirectUrl(token as string, history)
					// const redirect = qparam.redirect ? qparam.redirect.toString() : "/";
					// history.push(redirect);
				}
				// window.location.href = url
			}
		} catch (error) {
			// console.log(error.response)
			if (error.response && error.response.status == 400) {
				toastr.error("Token is invalid.");
			}
		}
	};

	useEffect(() => {
		loginViaQueryStringToken();

		const qparam = qs.parse(window.location.search);
		if (qparam.email) {
			setValue("username", qparam.email as any);
		}
	}, []);


	const handleRegister = () => {
		const values = getValues()
		// const qparam = qs.parse(window.location.search);
		// let redirectUrl = qparam.redirect ? qparam.redirect.toString() : "/";
		// let st = qparam.st ? qparam.st.toString() : "";
		// let s = qparam.s ? qparam.s.toString() : "";
		// history.push(`/register?s=${s}&st=${st}&redirect=${redirectUrl}&email=${values.username}`)

		// console.log(qparam)

		let qsparseurl = qs.parseUrl(window.location.href)
		let query : any = qsparseurl.query || {}
		query['email'] = values.username

		console.log("qsparseurl", qsparseurl)
		let pushUrl = qs.stringifyUrl({
			url: '/register',
			query: query
		})
		history.push(decodeURIComponent(pushUrl))
	}

	return (
		<form onSubmit={handleSubmit(onSubmit_)} className="uform uform-vertical">
			<Loading ref={loadingEl} overlay />
			<div className="inner">
				<h2 className="heading">Sign In</h2>

				<div className="mb-3">
					<label>Email</label>
					<input
						type="email"
						{...register("username", { required: true })}
						className="form-control"
					/>
					<ErrorLabel field={errors.username} />
				</div>

				<div className="mb-3">
					<label>Password</label>
					<input
						type="password"
						{...register("password", { required: true })}
						className="form-control"
					/>
					<ErrorLabel field={errors.password} />
				</div>

				<div className="text-end">
					<button type="button" className="btn btn-secondary me-3" onClick={handleRegister}>Register</button>
					<input
						type="submit"
						className="btn btn-primary"
						value="Sign In"
					/>
				</div>

				<div className="loginFooter">
					{/* <Link className="" to={"/join_prosper"}>
						Don't have an account ?
					</Link> */}
					<Link className="login-form-forgot" to={"/auth/forgot_password"}>
						Forgot password?
					</Link>
				</div>
			</div>
		</form>
	);
}
