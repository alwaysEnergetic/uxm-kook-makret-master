import React, { useState } from "react";
import dotObject from "@khanakiajs/dot-object";
import { useApolloClient, ApolloError } from "@apollo/client";
import { QUERY_ITEMS_REST } from "./query";
import { ListItem } from "./constant"

export type ItemsQueryRequestParam = {
	meta: {
		page?: number
		limit?: number
		orderBy?: any;
		extra?: {
			searchText?: string
			sellerUid?: string
			preview?: boolean
			isEvent?: boolean
			// cacheKey?: boolean
		}
	}
}

export type ItemsQueryResponse = {
	items?: Array<ListItem>
	meta: {
		total?: number;
		page?: number;
		limit?: number;
		orderBy?: any;
		extra?: {
			searchText?: string
			sellerUid?: string
			preview?: boolean
			cache?: boolean
		}
	},
	extra?: {
		totalHidden?: number
	}
}

export default function useItemsQuery(callback?: (ItemsQueryResponse) => void ) {
	const client = useApolloClient();
	const [loading, setLoading] = useState<boolean>(true);
	const [noResultFound, setNoResultFound] = useState<boolean>(false);
	const [items, setItems] = useState<Array<ListItem>>([]);
	const [result, setResult] = useState<ItemsQueryResponse>({
		items: [],
		meta: {
			page: 1,
			limit: 10
		}
	});


	const doSearch = (requestParam: ItemsQueryRequestParam) => {
		setLoading(true)
		// let requestParam: ItemsQueryRequestParam = {
		// 	meta: {
		// 		page: param.page,
		// 		limit: param.limit,
		// 		extra: {
		// 			sellerUid: param.sellerUid,
		// 			preview: param.preview ? true : false,
		// 			searchText: param.searchText
		// 		}
		// 	}
		// }

		client
			.query({
				query: QUERY_ITEMS_REST,
				fetchPolicy: "network-only",
				variables: {
					input: requestParam,
				},
			})
			.then((res) => {
				// console.log(res);
				const resp: ItemsQueryResponse = dotObject.getArrayValue(res, ["data", 'items'], null);
				// const items = dotObject.getArrayValue(res, ["data", "items", "items"], []);
				// const meta = dotObject.getArrayValue(res, ["data", "items", "meta"], {});
				// const extra = dotObject.getArrayValue(res, ["data", "items", "extra"], {});
				const showNoResults = resp.items && resp.items.length > 0 ? false : true;
				setNoResultFound(showNoResults)
				setLoading(false)
				// setItems(items)
				setResult(resp)
				// console.log(resp)

        if (typeof callback =='function') {
          callback(resp)
        }
			})
			.catch((err: ApolloError) => {
				// const errorParser = new KookErrorParser(err);
				// toastr.error(errorParser.message);
			})
			.finally(() => {
				setLoading(false)
			});
	};

	const showSkeleton = result.items && result.items.length == 0 && (loading || !noResultFound);

	return {
		// items,
		result,
		client,
		doSearch,
		showSkeleton,
		loading,
		noResultFound
	}	
}