import React, { useEffect } from "react";
import { getPlugin } from "@kookjs-client/core";
import Auth from "@kookjs-client/auth";
import { useApolloClient, ApolloError } from "@apollo/client";
import { MUTATION_ITEM_SINGLE_BONUS_POINT } from "../query";
export default function BonusPointSingeItem(props: {pid: string}) {
	const { pid } = props;
	const auth = getPlugin(Auth);
	const client = useApolloClient();

	const sendPoint = () => {
		client
			.mutate({
				mutation: MUTATION_ITEM_SINGLE_BONUS_POINT,
				variables: {
					input: {
						itemId: pid,
					},
				},
			})
			.then((res) => {

			})
			.catch((err: ApolloError) => {

			})
			.finally(() => {
			
			});
	};

	useEffect(() => {
		if (pid && auth.isUserLoggedIn()) {
			sendPoint();
		}
	}, []);

	return null
}
