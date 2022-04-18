import { TxType} from './constant'

export function getEnquiryButtonLabel(txType) {
	switch (txType) {
		case TxType.COUPON_VOUCHER:
			return 'Accept'
			break;

		default:
			return 'Enquiry'
			break;
	}
}

export function getEnquiryFormHeading(txType) {
	switch (txType) {
		case TxType.COUPON_VOUCHER:
			return 'Submit Your Information'
			break;
		default:
			return 'Enquiry Form'
			break;
	}
}

export function canEnquiryButtonShowFn(txType) {
	switch (txType) {
		case TxType.B2B_RFP:
			return true
			break;
		default:
			return false
			break;
	}
}

export function txTypeHasCart(txType) {
	switch (txType) {
		case TxType.ONLINE_ON_UXM:
			return true
			break;
		case TxType.OFFLINE_ON_UXM:
			return true
			break;
		default:
			return false
			break;
	}
}