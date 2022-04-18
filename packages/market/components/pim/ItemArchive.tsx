import React, { useEffect, lazy } from "react";
import { Link, useLocation } from "react-router-dom";
import Pagination from "rc-pagination";
import dotObject from "@khanakiajs/dot-object";
import { useQueryParams, useQueryParam, StringParam, NumberParam, ArrayParam, JsonParam, BooleanParam, withDefault } from "use-query-params";
import { getPlugin } from "@kookjs-client/core";
import Auth from "@kookjs-client/auth";
import { datalayerPush } from "@kookjs-client/util";
import { isEventCookieExists } from "@kookjs-client/uxm"
import { Loading } from "@kookjs-client/core/components/shared/Loading";
import ShowWrap from "@kookjs-client/core/components/shared/ShowWrap";
import Skeleton from "@kookjs-client/core/components/shared/Skeleton";

import SellerEditInfo from "./SellerEditInfo";
import ItemList from "./item/ItemList";
import ItemSearchInput from './ItemSearchInput'
import ItemInfinite from "./ItemInfinite"
import ItemArchiveBanners from "./ItemArchiveBanners"

const ItemPopularList = lazy(() => import('./item/ItemPopularList'));
import useItemsQuery, { ItemsQueryRequestParam} from  './useItemsQuery'

export default () => {
	const location = useLocation();

	const auth = getPlugin(Auth);
	const [query, setQuery] = useQueryParams({
		s: withDefault(StringParam, ""),
		page: withDefault(NumberParam, 1),
		sellerUid: withDefault(StringParam, ""),
		previewId: withDefault(StringParam, ""),
		debug: withDefault(BooleanParam, false),
	});

	const { doSearch, result, showSkeleton, noResultFound, loading } = useItemsQuery();

	const doSearch_ = () => {
		let requestParam: ItemsQueryRequestParam = {
			meta: {
				page: query.page,
				limit: 10,
				extra: {
					sellerUid: query.sellerUid,
					preview: query.previewId ? true : false,
					searchText: query.s,
					isEvent: isEventCookieExists()
				},
			},
		};

		doSearch(requestParam);

		if (query.s) {
			datalayerPush({
				event: "uxm",
				category: "Search",
				action: "catalogue_search",
				label: `${query.s} - ${auth.getUserEmail()}`,
			});
		}
	};

	const handleSearch = (val) => {
		setQuery({
			s: val,
			page: undefined,
		});
	};

	const handlePageChange = (page, pageSize) => {
		setQuery({
			page,
		});
	};

	useEffect(() => {
		doSearch_();
	}, [query.s, query.page]);

	const { meta, items, extra } = result;
	const { limit, page, total } = meta;
	const totalHidden = dotObject.getArrayValue(extra, ["totalHidden"], 0);

	// console.log(query.s)

	return (
		<div className={"CatalogueComp"}>
			<Loading overlay show={loading} />
			<div className="container">
				<div className="row">
					<div className="col-12 col-md-12 col-lg-8">
						<ItemSearchInput
							defaultValue={query.s || null}
							onChange={(val) => handleSearch(val)}
						/>
						<ShowWrap show={showSkeleton}>
							<Skeleton />
							<Skeleton />
							<Skeleton />
						</ShowWrap>
						<ShowWrap show={noResultFound}>
							<div className="noSearchResultsWrapper">
								{query.s ? 
									<h3>No results for {query.s} found.</h3> : 
									<h3>No results found.</h3> 
								}
								<p>Try checking your spelling or use more general terms</p>
							</div>
						</ShowWrap>

						<div className="ItemsList">
							<ItemList
								items={items}
								debug={query.debug}
								anchorTarget={"_blank"}
								searchText={query.s}
							/>
						</div>

						<div className="paginationWrapper">
							<Pagination
								onChange={handlePageChange}
								pageSize={limit}
								current={page}
								total={total}
							/>
						</div>
					</div>
					<div className="col-12 col-lg-3 offset-lg-1 mt-5 mt-lg-0">
						{query.previewId && !isEventCookieExists() ? (
							<SellerEditInfo total={total} totalHidden={totalHidden} />
						) : null}

						{!query.previewId && isEventCookieExists() ? (
							<div className="blockInfo">
								<h4>Categories</h4>
								<ul>
								<li><Link to={"/catalogue?s=Music"}>Music</Link></li>
								<li><Link to={"/catalogue?s=Music Industry Services"}>Music Industry Services</Link></li>
								<li><Link to={"/catalogue?s=Clothing and Fashion"}>Clothing and Fashion</Link></li>
								<li><Link to={"/catalogue?s=Books"}>Books</Link></li>
								<li><Link to={"/catalogue?s=Musical Instruments"}>Musical Instruments</Link></li>
								<li><Link to={"/catalogue?s=Pro Audio"}>Pro Audio</Link></li>
								<li><Link to={"/catalogue?s=Movies and TV"}>Movies and TV</Link></li>
								<li><Link to={"/catalogue?s=Beauty and Personal Care"}>Beauty and Personal Care</Link></li>
								<li><Link to={"/catalogue?s=Beverage"}>Beverage</Link></li>
								<li><Link to={"/catalogue?s=Consumer Electronics"}>Consumer Electronics</Link></li>
								<li><Link to={"/catalogue?s=Consumer Services"}>Consumer Services</Link></li>
								<li><Link to={"/catalogue?s=Data Storage and Management"}>Data Storage and Management</Link></li>
								<li><Link to={"/catalogue?s=Education"}>Education</Link></li>
								<li><Link to={"/catalogue?s=Finance"}>Finance</Link></li>
								<li><Link to={"/catalogue?s=Fitness"}>Fitness</Link></li>
								<li><Link to={"/catalogue?s=Food"}>Food</Link></li>
								<li><Link to={"/catalogue?s=Games"}>Games</Link></li>
								<li><Link to={"/catalogue?s=Health and Fitness"}>Health and Fitness</Link></li>
								<li><Link to={"/catalogue?s=Internet"}>Internet</Link></li>
								<li><Link to={"/catalogue?s=Jewelry"}>Jewelry</Link></li>
								<li><Link to={"/catalogue?s=Legal"}>Legal</Link></li>
								<li><Link to={"/catalogue?s=Watches"}>Watches</Link></li>
								<li><Link to={"/catalogue?s=Luggage"}>Luggage</Link></li>
								<li><Link to={"/catalogue?s=Sports and Outdoors"}>Sports and Outdoors</Link></li>
								<li><Link to={"/catalogue?s=Toys"}>Toys</Link></li>
								<li><Link to={"/catalogue?s=Transportation"}>Transportation</Link></li>
								<li><Link to={"/catalogue?s=Travel"}>Travel</Link></li>
								<li><Link to={"/catalogue?s=Vitamins and supplements"}>Vitamins and supplements</Link></li>
								<li><Link to={"/catalogue?s=Safety and Security"}>Safety and Security</Link></li>
								<li><Link to={"/catalogue?s=Other"}>Other</Link></li>
								</ul>
							</div>
						) : null}


						<ItemArchiveBanners show={!query.previewId} />
					</div>
				</div>

				{loading == false && !query.previewId ? <ItemPopularList /> : null}

				{loading == false && !query.previewId ? 
					<ItemInfinite 
						title="More Items You May Be Interested In"
						// searchText={'watch'}
						className="mt-5"
					/>
				: null}
			</div>
		</div>
	);
};