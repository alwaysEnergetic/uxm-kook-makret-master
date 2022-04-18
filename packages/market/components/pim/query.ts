import { gql } from '@apollo/client';

export const QUERY_ITEMS_REST = gql`
	query Items($input: QueryInput!) {
		items: items(input: $input)
			@rest(
				path: "/items/list"
				method: "POST" 				
			) {
        meta {
					total
					page
					limit
					orderBy {
						key
						value
					}
				}
				extra {
					totalHidden
				}
				items {
					id
					noIndex,
					offerDesc,
					offerType,
					offerValue,
					offerValueFrom,
					offerValueMode,
					offerValueTo,
					offerValueType,
					priceFrom,
					priceMode,
					priceTo,
					retailPrice,
					salePrice,
					shortDesc,
					slug,
					statusId,
					subTitle,
					title,
					txTypeId,
					images
				}
      }
	}
`;

export const QUERY_ITEM_BYSlUG_REST = gql`
	query Item($slug: String!) {
		item(slug: $slug)
		@rest(
				path: "/items/slug/{args.slug}"
				method: "GET" 
		) {
				id
				uid
				statusId
				brand
				title
				subTitle
				shortDesc
				descr
				status
				couponCode,
				merchantCode
				offerDesc,
				offerType,
				offerValue,
				offerValueFrom,
				offerValueMode,
				offerValueTo,
				offerValueType,
				optimizationId,
				ppaAmount,
				priceFrom,
				priceMode,
				priceTo,
				redirectLink,
				retailPrice,
				salePrice,
				txTypeId,
				vendorProductId
				qty
				storePolicyId
				itemCategoryName
				suggestionKeyword
				attribs {
					key
					name
					value
				}
				images {
					url
				}

		}
	}
`;

export const MUTATION_REGISTER_BYEMAIL = gql`
  mutation RegisterByEmail($input: Input!) {
    register_byemail(input: $input) 
		@rest(
			path: "/auth/register_byemail"
			method: "POST"
		)
		{
			uid
		}
  }
`;


export const MUTATION_MERCHANT_FOLLOW = gql`
  mutation MerchantFollow($input: Input!) {
    merchant_follow(input: $input) 
		@rest(
			path: "/p/merchant_follow"
			method: "POST"
		)
		{
			message
		}
  }
`;

export const QUERY_MERCHANT_FOLLOW_STATUS = gql`
	query MerchantFollowStatus($input: Input!) {
		merchant_follow_status(input: $input)
		@rest(
				path: "/p/merchant_follow/status"
				method: "POST" 
		) {
			status
		}
	}
`;

export const MUTATION_ITEM_ENQUIRY_SUBMIT = gql`
  mutation ItemEnquiry($input: Input!) {
    item_enquiry(input: $input) 
		@rest(
			path: "/m/item_enquiries"
			method: "POST"
		)
		{
			message
		}
  }
`;

export const MUTATION_ITEM_SINGLE_BONUS_POINT = gql`
  mutation ItemSingleBonusPoint($input: Input!) {
    ItemSingleBonusPoint(input: $input) 
		@rest(
			path: "/p/item_bonus"
			method: "POST"
		)
		{
			message
		}
  }
`;


export const queryStorePolicy = gql`
	query queryStorePolicy($id: Float!) {
		queryStorePolicy(id: $id)
		@rest(
				path: "/store_policies/view/{args.id}"
				method: "GET" 
		) {
				displayName
				descr
		}
	}
`;