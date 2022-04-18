import React, { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router";
import { Helmet } from "react-helmet";
import { useApolloClient, ApolloError, useQuery, useLazyQuery, useMutation, gql } from "@apollo/client";
import qs from 'query-string'
import { Loading } from "@kookjs-client/core/components/shared/Loading";
import ShowWrap from "@kookjs-client/core/components/shared/ShowWrap";
import LineBreak from "@kookjs-client/core/components/shared/LineBreak";

import { PriceBlock, OfferDescripton, PpaPriceBlock, PpaPriceAfterDiscount } from "./item/PriceBlock";
import EnquiryButton from "./item/EnquiryButton";
import BuyNowButton from "./item/BuyNowButton";
import ItemTitleBlock from "./item/ItemTitleBlock";
import ItemCarouselBlock from "./item/ItemCarouselBlock";
import FollowUserButton from "./item/FollowUserButton";
import AddToCartButton from "./item/AddToCartButton";
import BonusPointSingeItem from "./item/BonusPointSingeItem"
import StorePolicy from "./item/StorePolicy"
import ShoppingAssistant from "./item/ShoppingAssistant"
import ItemInfinite from "./ItemInfinite"
// import BonusPoint from './item/BonusPoint'

// import LineBreak from '../components/Shared/LineBreak'
// import Loading from '../components/Shared/Loading'
// import ShowWrap from '../components/Shared/ShowWrap'
import { TxType, Item as TItem } from "./constant";
import ShowOptinMessage from "./ShowOptinMessage";

import { QUERY_ITEM_BYSlUG_REST } from "./query";
import { KookErrorParser } from "@kookjs-client/core";
import dotObject from "@khanakiajs/dot-object";

export default () => {
	const loadingEl = useRef<any>();
	const [item, setItem] = useState<TItem>();
	let { slug } = useParams<any>();
	const history = useHistory();
	const client = useApolloClient();
	const [loading, setLoading] = useState<boolean>(true);
	const qparam = qs.parse(window.location.search);

	const getItem = (slug) => {
		// loadingEl.current.show()
		slug = slug + window.location.search;
		// console.log(slug)

		// itemShowBySlug(slug).then((res) => {
		// 	// loadingEl.current.hide()
		// 	const result = res.data
		// 	if (result.error) {
		// 		toastr.error('Item removed by seller.')
		// 		history.push('/catalogue')
		// 		return
		// 	}
		// 	setItem(result.data)
		// }).catch(error => {
		// 	loadingEl.current.hide()
		// 	toastr.error('Item removed by seller.')
		// 	history.push('/catalogue')
		// })

		client
			.query({
				query: QUERY_ITEM_BYSlUG_REST,
				variables: {
					slug,
				},
			})
			.then((response) => {
				// console.log(response)
				const data = dotObject.getArrayValue(response, ["data", "item"], {});
				// console.log(data)
				setItem(data);
				setLoading(false)
			})
			.catch((err: ApolloError) => {
				const errorParser = new KookErrorParser(err);
				toastr.error(errorParser.message);
			})
			.finally(() => {
				// loadingEl.current ? loadingEl.current.hide() : null;
			});
	};

	useEffect(() => {
		getItem(slug);
	}, []);

	if (!item) return <Loading ref={loadingEl} show={true} />;

	// console.log(item.noIndex)
	// console.log(item.attribs)

	return (
		<div className="ItemSingleContainer">
			<Helmet>
				<title>{item.title ? item.title : APP_CONFIG.siteTitle}</title>
			</Helmet>
			<ShowWrap show={item.noIndex}>
				<Helmet>
					<meta name="robots" content="noindex, follow" />
				</Helmet>
			</ShowWrap>
			<ShowOptinMessage />
			{ !loading ? <BonusPointSingeItem pid={item.uid} /> : null }
			{/* <BonusPoint /> */}
			<div className="ItemSingleWrapper">
				<div className="carouselWrapper">
					<ItemCarouselBlock key={Math.random()} images={item.images} />
				</div>
				<div className="productWrapper">
					<div className="aboutProduct">
						<ItemTitleBlock className="" title={item.title} subTitle={item.subTitle} />

						{/* <div className="shortDescription">
							<LineBreak text={item.shortDesc} />
						</div> */}

						<div className="longDescription d-none d-md-block">
							<LineBreak text={item.descr} />
						</div>
					</div>
				</div>
				<div className="sidebar">
					{ !loading ? <FollowUserButton pid={item.uid} /> : null }

					<ShoppingAssistant
						attribs={item.attribs}
						brand={item.brand}
						itemCategoryName={item.itemCategoryName}
						suggestionKeyword={item.suggestionKeyword}
					/>

					<div className="blockInfo">
						<OfferDescripton offerDescription={item.offerDesc} show={item.offerType == "bonus"} />

						<PriceBlock
							txType={item.txTypeId}
							price={item.salePrice}
							mrp={item.retailPrice}
							offerDescription={item.offerDesc}
							// bonusValueDisplay={item.bonusValueDisplay}
						/>

						<PpaPriceBlock
							priceMode={item.priceMode}
							price={item.salePrice}
							priceFrom={item.priceFrom}
							priceTo={item.priceTo}
							offerType={item.offerType}
							txType={item.txTypeId}
						/>
						<PpaPriceAfterDiscount
							className="mb-2"
							priceMode={item.priceMode}
							price={item.salePrice}
							priceFrom={item.priceFrom}
							priceTo={item.priceTo}
							offerValueType={item.offerValueType}
							offerValueMode={item.offerValueMode}
							offerValue={item.offerValue}
							offerValueFrom={item.offerValueFrom}
							offerValueTo={item.offerValueTo}
							offerType={item.offerType}
							txType={item.txTypeId}
						/>

						<OfferDescripton offerDescription={item.offerDesc} show={item.offerType == "discount"} />

						<ShowWrap show={item.txTypeId == TxType.B2B_RFP}>
							<div className="b2b-button style1">B2B</div>
						</ShowWrap>

						<EnquiryButton statusId={item.statusId} txType={item.txTypeId} itemId={item.uid} className="mt-3" />

						<AddToCartButton qty={item.qty} statusId={item.statusId} txType={item.txTypeId} itemId={item.uid} className="mt-3" />
					</div>
					
					<BuyNowButton
						className="mt-2"
						statusId={item.statusId}
						txType={item.txTypeId}
						redirectUrl={item.redirectLink}
						_id={item.id}
						vendorProductId={item.vendorProductId}
						couponCode={item.couponCode}
					/>

					<ShowWrap show={item.attribs && item.attribs.length>0}>
						<div className="blockInfo itemAttribs">
							{(item.attribs||[]).map((attrib, i) => {
								return (
									<div key={i} className="attrib">
										<div className="name">{attrib.name}</div>
										<div className="value">{attrib.value}</div>
									</div>
								)
							})}
						</div>
					</ShowWrap>

					<div className="">
						<StorePolicy policyId={item.storePolicyId} />
					</div>
				</div>

				<div className="longDescription d-block d-md-none mt-4">
					<LineBreak text={item.descr} />
				</div>
			</div>

			{ !loading ? 
			<ItemInfinite 
				title="More Items You May Be Interested In"
				searchText={qparam.s as string || item.suggestionKeyword}
				// searchText={item.itemCategoryName}
				// searchText={'watch'}
				className="singleItem"
				skipIds={[item.id]}
			/>
			: null }
		</div>
	);
}