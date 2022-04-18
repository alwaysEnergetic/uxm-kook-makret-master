import React, { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { Helmet } from "react-helmet";
import {
	useApolloClient,
	ApolloError,
	useQuery,
	useLazyQuery,
	useMutation,
	gql,
} from "@apollo/client";
// import ReactSelect from "react-select";

import { getPlugin, KookErrorParser } from "@kookjs-client/core";
import Auth from "@kookjs-client/auth";

import { Loading } from "@kookjs-client/core/components/shared/Loading";
import ShowWrap from "@kookjs-client/core/components/shared/ShowWrap";
import LineBreak from "@kookjs-client/core/components/shared/LineBreak";
import ErrorLabel from "@kookjs-client/core/components/shared/ErrorLabel";
import { QUERY_ADDRESS_LIST_FULL_REST } from "../address/query";

import dotObject from "@khanakiajs/dot-object";

import CountrySelectRHF from "../shared/CountrySelectRHF";
import StateSelectRHF from "../shared/StateSelectRHF";

import { MUTATION_CART_SAVE_ADDRESS } from "./query";

export default (props: {
	cartId: number;
	address?: any;
	onUpdate?: Function;
}) => {
	const { cartId, address = {}, onUpdate } = props;
	const loadingEl = useRef<any>();

	const history = useHistory();
	const client = useApolloClient();
	const auth = getPlugin(Auth);

	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
		setValue,
		getValues,
		watch,
	} = useForm({
		defaultValues: {
			firstName: null,
			lastName: null,
			phone: null,
			email: null,
			addressLine1: null,
			addressLine2: null,
			countryId: null,
			stateId: null,
			city: null,
			zip: null,
		},
	});

	const [countryId] = watch(["countryId"]);

	const onSubmit_ = async (data) => {
		// data.countryId = country
		// console.log(data)
		// return

		localStorage.setItem("address", JSON.stringify(data));

		loadingEl.current.show();
		data.cartId = cartId;
		data.sessionId = auth.getClientSessionId();
		client
			.mutate({
				mutation: MUTATION_CART_SAVE_ADDRESS,
				variables: {
					input: data,
				},
			})
			.then((res) => {
				// toastr.success("Address Updated to cart.");
				// const qparam = qs.parse(window.location.search);
				// history.push(qparam.redirect || '/')
				// history.push(`/${setting.slugPlural}?refetch=1`);

				// console.log(typeof onUpdate)

				if (typeof onUpdate == "function") {
					onUpdate();
				}
			})
			.catch((err: ApolloError) => {
				const errorParser = new KookErrorParser(err);
				toastr.error(errorParser.message);
			})
			.finally(() => {
				loadingEl.current ? loadingEl.current.hide() : null;
			});
	};

	useEffect(() => {
		// We need this because even react Select gets empty on Country Change but the stateId is still available in RHF form state so we need to clear the value from the state also
		const stateId = getValues("stateId");
		if (stateId) return;
		setValue("stateId", null, {
			shouldValidate: false,
			shouldDirty: true,
		});
		// console.log("Updating value")
	}, [countryId]);

	useEffect(() => {
		let addressNew = address;
		if (address.firstName == "") {
			let ladd = JSON.parse(localStorage.getItem("address"));
			if (ladd) addressNew = ladd;
		}

		Object.keys(addressNew).forEach((key: any) => {
			// console.log(key)
			setValue(key, addressNew[key], {
				shouldValidate: false,
				shouldDirty: true,
			});
		});
	}, [JSON.stringify(address)]);

	return (
		<React.Fragment>
			<Loading ref={loadingEl} overlay />
			<div className="AddressForm mt-3">
				<form onSubmit={handleSubmit(onSubmit_)}>
					<div className="row g-3">
						<div className="col-md-6">
							<label>First Name</label>
							<input
								type="text"
								className="form-control"
								{...register("firstName", { required: true })}
							/>
							<ErrorLabel field={errors.firstName} />
						</div>
						<div className="col-md-6">
							<label>Last Name</label>
							<input
								type="text"
								className="form-control"
								{...register("lastName", { required: true })}
							/>
							<ErrorLabel field={errors.lastName} />
						</div>

						<div className="col-md-6">
							<label>Phone</label>
							<input
								type="text"
								className="form-control"
								{...register("phone", { required: true })}
								maxLength={15}
							/>
							<ErrorLabel field={errors.phone} />
						</div>

						<div className="col-md-6">
							<label>Email</label>
							<input
								type="text"
								className="form-control"
								{...register("email", {
									required: true,
									pattern: /^\S+@\S+$/i,
								})}
								maxLength={254}
							/>
							<ErrorLabel field={errors.email} />
						</div>

						<div className="col-md-12">
							<label>Address</label>
							<input
								type="text"
								className="form-control"
								{...register("addressLine1", { required: true })}
								placeholder="1234 Main St"
							/>
							<ErrorLabel field={errors.addressLine1} />
						</div>
						<div className="col-md-12">
							<input
								type="text"
								className="form-control"
								{...register("addressLine2")}
								placeholder="Apartment, studio, or floor"
							/>
						</div>

						<div className="col-md-6">
							<label>Country</label>
							<CountrySelectRHF
								name="countryId"
								control={control}
								rules={{ required: true }}
							/>
							<ErrorLabel field={errors.countryId} />
						</div>
						<div className="col-md-6">
							<label>State</label>
							<StateSelectRHF
								rules={{ required: true }}
								name="stateId"
								setValue={setValue}
								control={control}
								countryId={countryId}
							/>
							<ErrorLabel field={errors.stateId} />
						</div>

						<div className="col-md-6">
							<label>City</label>
							<input
								type="text"
								className="form-control"
								{...register("city", { required: true })}
							/>
							<ErrorLabel field={errors.city} />
						</div>
						<div className="col-md-6">
							<label>Zip</label>
							<input
								type="text"
								className="form-control"
								{...register("zip", { required: true })}
							/>
							<ErrorLabel field={errors.zip} />
						</div>
            
            <div className="text-end col-md-12">
              <button type="submit" className="btn btn-primary">
                Use This Shipping Address
              </button>
            </div>
					</div>

				</form>
			</div>
		</React.Fragment>
	);
};
