export const TxType = {
	ONLINE_ON_UXM: 1,
	ON_SELLER_SITE: 2,
	OFFLINE_ON_UXM: 3,
	COUPON_VOUCHER: 4,
	LEAD_ACTION: 5,
	AFFILIATE: 6,
	B2B_RFP: 7
};

export type TX_ONLINE_ON_UXM = 1
export type TX_ON_SELLER_SITE = 2
export type TX_OFFLINE_ON_UXM = 3
export type TX_COUPON_VOUCHER = 4
export type TX_LEAD_ACTION = 5
export type TX_AFFILIATE = 6
export type B2B_RFP = 7

export type TTxType = TX_ONLINE_ON_UXM | TX_ON_SELLER_SITE | TX_OFFLINE_ON_UXM | TX_COUPON_VOUCHER | TX_LEAD_ACTION | TX_AFFILIATE | B2B_RFP

export type PriceModeSingle       = "single"
export type PriceModeRange        = "range"
export type PriceModeNoSpecific   = "nospecific"
export type PriceMode = PriceModeSingle | PriceModeRange | PriceModeNoSpecific
export type OfferTypeDiscount     = "discount"
export type OfferTypeBonus        = "bonus"
export type OfferType = OfferTypeDiscount | OfferTypeBonus
export type OfferValueModeSingle  = "single"
export type OfferValueModeRange   = "range"
export type OfferValueMode = OfferValueModeSingle | OfferValueModeRange
export type OfferValueTypeFixed   = "fixed"
export type OfferValueTypePercent = "percent"
export type OfferValueType = OfferValueTypeFixed | OfferValueTypePercent
export type ItemStatusPublished   = 1
export type ItemStatusHidden      = 2
export type ItemStatus = ItemStatusPublished | ItemStatusHidden
export type CapabilityCanSell            = "can_sell"
export type CapabilityCanSellAffiliate   = "can_sell_affiliate"
export type Capability = CapabilityCanSell | CapabilityCanSellAffiliate



export const Status = {
	PUBLISHED: 1
}

export const NOIMAGE_URL = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'

type ImageSize = "full" | "small";

export type ItemImage = {
	url: string;
	size: ImageSize
}

export type ItemAttributes = {
	name: string;
	key: string
	value: string
}

export type Item = {
	id: number
	uid: string
	commissionId: string
	couponCode: string
	descr: string
	images: ItemImage[]
	itemCategoryId: number
	itemCategoryName: string
	merchantCode: string
	offerDesc: string
	offerType: OfferType
	offerValue: number
	offerValueFrom: number
	offerValueMode: OfferValueMode
	offerValueTo: number
	offerValueType: OfferValueType
	optimizationId: 24
	ppaAmount: number
	priceFrom: number
	priceMode: PriceMode
	priceTo: number
	qty: number
	redirectLink: string
	retailPrice: number
	salePrice: number
	shortDesc: string
	statusId: number
	noIndex: boolean
	storePolicyId: number
	subTitle: string
	title: string
	brand: string
	txTypeId: TTxType
	vendorProductId: string
	attribs: ItemAttributes[]
	suggestionKeyword: string
}

export type ListItem = {
	id: number
	images: ItemImage[]
	offerDesc: string
	offerType: string
	offerValue: number
	offerValueFrom: number
	offerValueMode: OfferValueMode
	offerValueTo: number
	offerValueType: OfferValueType
	priceFrom: number
	priceMode: PriceMode
	priceTo: number
	retailPrice: number
	salePrice: number
	shortDesc: string
	slug: string
	statusId: ItemStatus
	noIndex: boolean
	subTitle: string
	title: string
	txTypeId: TTxType
}