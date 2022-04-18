import React, { useRef, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
	useQuery,
	useLazyQuery,
	useMutation,
	gql,
	useApolloClient,
} from "@apollo/client";
import {
	Loading,
	LoadingElement,
} from "@kookjs-client/core/components/shared/Loading";
import ErrorLabel from "@kookjs-client/core/components/shared/ErrorLabel";
import { ApolloError } from "@apollo/client";
import { KookErrorParser } from "@kookjs-client/core";
import { AUTH_FORGOT_PASSWORD_REST } from "../query";
import toastr from "toastr";
import dotObject from "@khanakiajs/dot-object";

export default (props) => {
	const loadingEl = useRef<LoadingElement>();
	const history = useHistory();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			username: "",
		},
	});
	const client = useApolloClient();

	const onSubmit_ = async (formData) => {
		// console.log(formData);

		loadingEl.current.show();
		client
			.mutate({
				mutation: AUTH_FORGOT_PASSWORD_REST,
				variables: {
					input: {
						username: formData.username,
					},
				},
			})
			.then((res) => {
				console.log(res);
				const note = dotObject.get(
					res,
					"data.authForgotPassword.message",
					"We have sent you an email."
				);
				toastr.success(note);
				history.push("/auth/reset_password");
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

	return (
		<form onSubmit={handleSubmit(onSubmit_)} className="uform uform-vertical">
			<Loading ref={loadingEl} overlay />
			<div className="inner">
				<h2 className="heading">Forgot Password</h2>

				<div className="mb-3">
					<label>Username or Email</label>
					<input
						type="text"
						{...register("username", { required: true })}
						className="form-control"
					/>
					<ErrorLabel field={errors.username} />
				</div>
				<input type="submit" className="btn btn-primary btn-block mt-2" />
			</div>
		</form>
	);
};
