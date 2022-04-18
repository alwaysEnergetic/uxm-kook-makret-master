import React, { useRef, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useApolloClient } from "@apollo/client";
import {Loading, LoadingElement} from "@kookjs-client/core/components/shared/Loading";
import ErrorLabel from "@kookjs-client/core/components/shared/ErrorLabel";
import { ApolloError } from '@apollo/client';
import { KookErrorParser } from '@kookjs-client/core'
import { CHANGE_PASSWORD } from "../query";
import toastr from 'toastr'

export default function Login() {
	const loadingEl = useRef<LoadingElement>();
	const history = useHistory();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			currentPassword: null,
			password: null,
			confirmPassword: null,
		},
	});
	const client = useApolloClient();

	const onSubmit_ = async (formData) => {
		// console.log(formData);

		loadingEl.current.show();
		client
			.mutate({
				mutation: CHANGE_PASSWORD,
				variables: {
					args: {
						currentPassword: formData.currentPassword,
						password: formData.password,
						confirmPassword: formData.confirmPassword,
					},
				},
			})
			.then((res) => {
				history.push("/");
				console.log(res);
			})
			.catch((err: ApolloError) => {
				const errorParser = new KookErrorParser(err);
				toastr.error(errorParser.message);
			})
			.finally(() => {
				loadingEl.current ? loadingEl.current.hide() : null;
			});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit_)} className="uform uform-vertical">
			<Loading ref={loadingEl} overlay />
			<div className="inner">
				<h2 className="heading">Change Password</h2>

				<div className="mb-3">
					<label>Current Password</label>
					<input
						type="password"
						{...register("currentPassword", { required: true })}
						className="form-control"
					/>
					<ErrorLabel field={errors.currentPassword} />
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

				<div className="mb-3">
					<label>Confirm New Password</label>
					<input
						type="password"
						{...register("confirmPassword", { required: true })}
						className="form-control"
					/>
					<ErrorLabel field={errors.confirmPassword} />
				</div>

				<input type="submit" className="btn btn-primary btn-block mt-2" />
			</div>
		</form>
	);
}
