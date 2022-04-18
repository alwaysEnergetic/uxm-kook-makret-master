import React from "react";
import { useForm } from "react-hook-form";

import { useApolloClient, ApolloError } from "@apollo/client";
import { KookErrorParser } from "@kookjs-client/core";

import { getEnquiryFormHeading } from "../function";
import { MUTATION_ITEM_ENQUIRY_SUBMIT } from "../query";

import ErrorLabel from "@kookjs-client/core/components/shared/ErrorLabel";

export default function EnquiryForm(props) {
	const { itemId, txType, onSubmit } = props;
	const { register, handleSubmit, watch, formState: { errors } } = useForm();
	const client = useApolloClient();

	const onSubmit_ = (data) => {
		data["itemId"] = itemId;
		client
			.mutate({
				mutation: MUTATION_ITEM_ENQUIRY_SUBMIT,
				variables: {
					input: data,
				},
			})
			.then((res) => {
				toastr.success("Submitted successfully.");
				if (typeof onSubmit == "function") onSubmit();
			})
			.catch((err: ApolloError) => {
				const errorParser = new KookErrorParser(err);
				toastr.error(errorParser.message);
			})
			.finally(() => {});
	};

	const enquriyFormHeading = getEnquiryFormHeading(txType);

	return (
        <form onSubmit={handleSubmit(onSubmit_)}>
			<div>
				<h3>{enquriyFormHeading}</h3>
			</div>

			<input
                {...register('name', { required: true })}
                className="form-control"
                placeholder="Your Name" />
			<ErrorLabel field={errors.name} />

			<input
                {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                className="form-control mt-2"
                placeholder="Email" />
			<ErrorLabel field={errors.email} />

			<input
                {...register('phone', { required: true })}
                className="form-control mt-2"
                placeholder="Phone" />
			<ErrorLabel field={errors.phone} />

			<textarea
                {...register('message', {})}
                className="form-control mt-2"
                placeholder="Message"></textarea>
			<ErrorLabel field={errors.message} />

			<input type="submit" className="btn btn-primary btn-block mt-2" />
		</form>
    );
}
