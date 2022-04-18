import React, { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import qs from 'query-string'
import { Link, useHistory } from "react-router-dom";

// import { grecaptchaExecute } from 'module/shared'
import { useApolloClient, ApolloError, useQuery, useLazyQuery, useMutation, gql } from "@apollo/client";
import dotObject from "@khanakiajs/dot-object";
import { Loading } from "@kookjs-client/core/components/shared/Loading";
import ErrorLabel from "@kookjs-client/core/components/shared/ErrorLabel";
import { getGlobalVariable, KookErrorParser } from "@kookjs-client/core";

import { MUTATION_NEWSLETTER_SEND_TO_FRIEND } from "./query";

export default () => {
	const loadingEl = useRef<any>();
	const history = useHistory();

	const parsed = qs.parse(window.location.search);
	const email = parsed.email ? parsed.email : null;
	const client = useApolloClient();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
		setValue,
	} = useForm({
		defaultValues: {
			name: null,
			email: email,
			friendName: null,
			friendEmail: null,
			signUpSource: parsed["s"] || null,
		},
	});

	const onSubmit_ = async (data) => {
		loadingEl.current.show();
		client
			.mutate({
				mutation: MUTATION_NEWSLETTER_SEND_TO_FRIEND,
				variables: {
					input: data,
				},
			})
			.then((res) => {
				toastr.success("Newsletter sent successfully.");
				history.push("/");
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
				<div className="text-center mb-4">
					<h3>Forward to Friend</h3>
					<h3>Grow Your UXM Network</h3>
				</div>
				<input
					className="d-none"
					type="text"
					{...register("signUpSource", {})}
				/>

				<div className="mb-3">
					<label>Your Email:</label>
					<input
						type="text"
						{...register("email", {
							required: true,
							pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/i,
						})}
						className="form-control mb-3"
						// placeholder="Enter Your Email"
						onChange={(e) => {
							setValue("email", e.target.value.trim(), {
								shouldValidate: true,
							}); // do you unTransform.
							// e.target.value = 'xxx' // do you transform here;
						}}
					/>
					{/* <ErrorLabel field={errors.email && errors.email.type == "required"} />
					<ErrorLabel
						field={errors.email && errors.email.type == "pattern"}
						message="Invalid email."
					/> */}
				</div>

				<div className="mb-3">
					<label>Your Name:</label>
					<input
						{...register("name", { required: true })}
						className="form-control"
					/>
					<ErrorLabel field={errors.name} />
				</div>

				<div className="mb-3">
					<label>Your Friend's Name:</label>
					<input
						{...register("friendName", { required: true })}
						className="form-control"
					/>
					<ErrorLabel field={errors.friendName} />
				</div>

				{/* <input name="lastName" className="form-control mt-2" placeholder="Enter Your Friend's Last Name" ref={register({ required: true })} />
        <ErrorLabel  field={errors.lastName} /> */}

				<div className="mb-3">
					<label>Your Friend's Email:</label>
					<input
						{...register("friendEmail", {
							required: true,
							// pattern: /^\S+@\S+$/i,
							pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/i,
						})}
						className="form-control"
						onChange={(e) => {
							setValue("friendEmail", e.target.value.trim(), {
								shouldValidate: true,
							}); // do you unTransform.
							// e.target.value = 'xxx' // do you transform here;
						}}
					/>
					<ErrorLabel
						field={errors.friendEmail && errors.friendEmail.type == "required"}
					/>
					<ErrorLabel
						field={errors.friendEmail && errors.friendEmail.type == "pattern"}
						message="Invalid email."
					/>
				</div>

				<input type="submit" className="btn btn-primary btn-block" />
			</div>
		</form>
	);
};