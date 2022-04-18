import React, { useEffect, useState, useRef } from "react";
import { getPlugin } from "@kookjs-client/core";
import dotObject from "@khanakiajs/dot-object";
import Auth from "@kookjs-client/auth";

import { useApolloClient, ApolloError } from "@apollo/client";
import { KookErrorParser } from "@kookjs-client/core";
import { QUERY_MERCHANT_FOLLOW_STATUS, MUTATION_MERCHANT_FOLLOW } from "../query";
import { Loading } from "@kookjs-client/core/components/shared/Loading";
export default function FollowUserButton(props: any = {}) {
	const { pid } = props;
	const loadingEl: any = useRef();
	const [followed, setFollowed] = useState(false);

	const auth = getPlugin(Auth);
	const client = useApolloClient();

	const checkIfFollowed = () => {
		client
			.query({
				query: QUERY_MERCHANT_FOLLOW_STATUS,
				variables: {
					input: {
						itemId: pid,
					},
				},
			})
			.then((res) => {
				// console.log(res);
				const data = dotObject.getArrayValue(res, ["data", "merchant_follow_status", "status"], false);
				setFollowed(data);
			})
			.catch((err: ApolloError) => {
				const errorParser = new KookErrorParser(err);
				toastr.error(errorParser.message);
			})
			.finally(() => {});
	};

	const followUser = () => {
		loadingEl.current.show();
		client
			.mutate({
				mutation: MUTATION_MERCHANT_FOLLOW,
				variables: {
					input: {
						itemId: pid,
					},
				},
			})
			.then((res) => {
				// toastr.success("Saved successfully.");
				setFollowed(!followed);
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
		if (pid && auth.isUserLoggedIn()) {
			checkIfFollowed();
		}
	}, []);

	if (!pid || !auth.isUserLoggedIn()) return null;

	const label = followed ? "Un-Follow this seller" : "Follow this seller";
	return (
		<div className="FollowUserButtonComp blockInfo text-end">
			<Loading ref={loadingEl} />
			<button className="btn btn-primary btn-sm btn-block" onClick={followUser}>
				<i className="fal fa-user-plus me-1"></i>{label}
			</button>
		</div>
	);
}
