import React, { useRef, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import qs from 'query-string'
import { useQuery, useLazyQuery, useMutation, gql, useApolloClient } from "@apollo/client";
import {Loading, LoadingElement} from "@kookjs-client/core/components/shared/Loading";
import ErrorLabel from "@kookjs-client/core/components/shared/ErrorLabel";
import { ApolloError } from '@apollo/client';
import { KookErrorParser } from '@kookjs-client/core'
import { AUTH_RESET_PASSWORD_REST } from "../query";
import toastr from 'toastr'
import dotObject from '@khanakiajs/dot-object'
import classNames from "classnames";

export default function Login(props) {
	const loadingEl = useRef<LoadingElement>();
	const history = useHistory();

	const qparam = qs.parse(window.location.search);

	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
		watch,
	} = useForm({
		defaultValues: {
			token: qparam.token,
			password: null,
		},
	});
	const client = useApolloClient();

	const onSubmit_ = async (formData) => {
		// console.log(formData);

		loadingEl.current.show();
		client
			.mutate({
				mutation: AUTH_RESET_PASSWORD_REST,
				variables: {
					input: {
						token: formData.token,
						password: formData.password,
					},
				},
			})
			.then((res) => {
				const note = dotObject.get(
					res,
					"data.authPasswordReset.message",
					"Password did reset successfully."
				);
				toastr.success(note);
				history.push("/login");
				// console.log(res)
			})
			.catch((err: ApolloError) => {
				const errorParser = new KookErrorParser(err);
				toastr.error(errorParser.message);
			})
			.finally(() => {
				loadingEl.current ? loadingEl.current.hide() : null;
			});
	};

	// console.log(watch('token'))
	const hideTokenGroup = watch("token") !== undefined;
	// console.log(hideTokenGroup)

	const showTokenGroupClass = classNames("mb-3", { "d-none": hideTokenGroup });

	return (
		<form onSubmit={handleSubmit(onSubmit_)} className="uform uform-vertical">
			<Loading ref={loadingEl} overlay />
			<div className="inner">
				<h2 className="heading">Reset Password</h2>

				<div className={showTokenGroupClass}>
					<label>Enter Reset Token</label>
					<input
						type="text"
						{...register("token", { required: true })}
						className="form-control"
					/>

					<div className="note mt-2">
						We sent you token on registered email {qparam.email}.
					</div>

					<ErrorLabel field={errors.token} />
				</div>

				<div className="mb-3">
					<label>New Password</label>
					<input
						type="password"
						{...register("password", { required: true })}
						className="form-control"
					/>
					<ErrorLabel field={errors.password} />
				</div>

				<input type="submit" className="btn btn-primary btn-block mt-2" />
			</div>
		</form>
	);
}