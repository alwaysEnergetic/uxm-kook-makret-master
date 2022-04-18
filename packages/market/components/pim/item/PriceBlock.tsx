import React, { useState } from 'react';
import classNames from 'classnames'
// import  {getPriceLabel} from '../../shared'
import ShowWrap from "@kookjs-client/core/components/shared/ShowWrap";
import {
	// TxType_OnlineOnUxm_Value,
	// TxType_OnlineOffUxm_Value,
  // TxType_OfflineOnUxm_Value,
  // TxType_PpaOnUxm_Value,
  // TxType_PpaOffUxm_Value,
  // TxType_Affiliate_Value,
  TxType
} from "../constant";

import { formatMoneyWithSymbol } from "@kookjs-client/util"


// function BonusBlock(props) {
//   const { offerDescription, bonusValueDisplay } = props
//   if(!offerDescription) return null

//   return (
//     <div className="compBonusBlock">
//       <div className="itemBous">
//         <span className="note">Offer: </span>
//         {offerDescription}
//       </div>

//       <ShowWrap show={bonusValueDisplay}>
//         <div className="">
//           <span className="note">Offer Value: </span>
//           {bonusValueDisplay}
//         </div>
//       </ShowWrap>
//     </div>
//   )
// }

/*
 This Price Block will show only for NON PPA TxTypes
*/

/*
  * Ref: PriceDisplay.xlsx
  * NOTE: This Price Block will show only for NON PPA TxTypes
  * That will show the L13 - IF NON-PPA: ● MRP: [Price] with strikethrough
  * That will show the L21 - IF NON-PPA: ● Price After Discount: [Price - Discount]
  * L38 - IF NON-PPA: ● xx% Discount
*/
function PriceBlock(props) {
  const {price, mrp, txType } = props
  

  if([
    // TxType_OnlineOnUxm_Value,
    // TxType_OnlineOffUxm_Value,
    // TxType_OfflineOnUxm_Value
    TxType.LEAD_ACTION,
    TxType.ONLINE_ON_UXM,
    TxType.OFFLINE_ON_UXM
  ].indexOf(txType)==-1) return null


  const showMrp = mrp && (price!==mrp)
  // const title = getPriceLabel(txType)

  // const { convert } = Sapp.UxmExchange.CurrencyC

  const discount = Math.round(100-(price*100/mrp))
  const showDiscount = discount && discount>0 ? true : false

  // console.log(props)

  return (
    <div className="Comp_PriceBlock priceBlock">
      <ShowWrap show={showMrp}>
        <div className="price">
          <span className="label">M.R.P.: </span>
          <span className="value strike">{formatMoneyWithSymbol(mrp)}</span>
        </div>
      </ShowWrap>
      
      <ShowWrap show={price>0}>
        <div className="price big">
          <span className="label">Price After Discount: </span>
          <span className="value">{formatMoneyWithSymbol(price)}</span>
        </div>
      </ShowWrap>

      <ShowWrap show={showDiscount}>
        <div className="discount">
          <span>{discount}% Discount </span>
        </div>
      </ShowWrap>

      {/* <BonusBlock offerDescription={offerDescription} bonusValueDisplay={bonusValueDisplay} /> */}
    </div>
  );
}


/*
  * Ref: PriceDisplay.xlsx
  * That will show the L15 (IF Discount) to L18 (IF No Retail Price then first line is blank )
  * That will show the L22 (IF PPA Then ...) to L25 (IF Bonus and No Retail Price: leave blank)
*/
function PpaPriceBlock(props) {
  const {priceMode, txType, price, priceFrom, priceTo, offerType  } = props

  if(priceMode=='nospecific') return null

  if([
    // TxType_PpaOnUxm_Value,
    // TxType_PpaOffUxm_Value,
    // TxType_Affiliate_Value
    TxType.COUPON_VOUCHER,
    TxType.LEAD_ACTION,
    TxType.AFFILIATE
  ].indexOf(txType)==-1) return null
  
  // const { convert } = Sapp.UxmExchange.CurrencyC

  const priceLabel = offerType=='discount' ? 'Regular Price' : 'Price'
  const strike = offerType=='discount'

  const classNameValue = classNames("value", {'strike' : strike })

  // console.log(props)
  return (
    <div className="Comp_PpaPriceBlock priceBlock">
        <div className="price">
          <span className="label">{priceLabel}: </span>
          <ShowWrap show={priceMode=='single'}>
            <span className={classNameValue}>{formatMoneyWithSymbol(price)}</span>
          </ShowWrap>
          <ShowWrap show={priceMode=='range'}>
            <span className={classNameValue}>{formatMoneyWithSymbol(priceFrom)} - {formatMoneyWithSymbol(priceTo)}</span>
          </ShowWrap>
        </div>
    </div>
  );
}


/*
  * Ref: PriceDisplay.xlsx
  * That will onlwy show the L26 ( IF Discount (Discounts will not apply....) to l36 (IF Discount Range and $...)
*/
function PpaPriceAfterDiscount(props) {
  const {
		txType,
		offerType,
		priceMode,
		price,
		priceFrom,
		priceTo,
		offerValueMode,
    offerValueType,
    offerValue,
    offerValueFrom,
    offerValueTo,
    className
  } = props;

  // console.log(props)

  if(offerType!=='discount') return null

  if(priceMode=='nospecific') return null

  if([
    // TxType_PpaOnUxm_Value,
    // TxType_PpaOffUxm_Value,
    // TxType_Affiliate_Value
    TxType.COUPON_VOUCHER,
    TxType.LEAD_ACTION,
    TxType.AFFILIATE
  ].indexOf(txType)==-1) return null

  

  let dmode = 'single'
  let dprice = 0
  let dpriceFrom = 0
  let dpriceTo = 0

  // let displayValue = null

  if(priceMode=='single' && offerValueMode=='single' && offerValueType=='fixed') {
    dprice = price - offerValue
  } else if(priceMode=='single' && offerValueMode=='single' && offerValueType=='percent') {
    dprice = price * ((100-offerValue)/100)
  } else if(priceMode=='single' && offerValueMode=='range' && offerValueType=='fixed') {
    dpriceFrom = price - offerValueFrom
    dpriceTo = price - offerValueTo
    dmode = 'range'
  } else if(priceMode=='single' && offerValueMode=='range' && offerValueType=='percent') {
    dpriceFrom = price * ((100-offerValueFrom)/100)
    dpriceTo = price * ((100-offerValueTo)/100)
    dmode = 'range'
  } else if(priceMode=='range' && offerValueMode=='single' && offerValueType=='fixed') {
    dpriceFrom = priceFrom - offerValue
    dpriceTo = priceTo - offerValue
    dmode = 'range'
  } else if(priceMode=='range' && offerValueMode=='single' && offerValueType=='percent') {
    dpriceFrom = priceFrom * ((100-offerValue)/100)
    dpriceTo = priceTo * ((100-offerValue)/100)
    dmode = 'range'
  } else if(priceMode=='range' && offerValueMode=='range' && offerValueType=='fixed') {
    dpriceFrom = priceFrom - offerValueFrom
    dpriceTo = priceTo - offerValueTo
    dmode = 'range'
  } else if(priceMode=='range' && offerValueMode=='range' && offerValueType=='percent') {
    dpriceFrom = priceFrom * ((100-offerValueFrom)/100)
    dpriceTo = priceTo * ((100-offerValueTo)/100)
    dmode = 'range'
  }

  // const { convert } = Sapp.UxmExchange.CurrencyC
  const classNameValue = classNames("value")
  const className_ = classNames('Comp_PpaPriceAfterDiscount priceBlock', className)
  
  return (
    <div className={className_}>
        <div className="price big">
          <span className="label">Price After Discount: </span>
          <ShowWrap show={dmode=='single'}>
            <span className={classNameValue}>{formatMoneyWithSymbol(dprice)}</span>
          </ShowWrap>
          <ShowWrap show={dmode=='range'}>
            {
              // Check screenshot efakurrprvkcj.png
              dpriceFrom<dpriceTo ?
              <span className={classNameValue}>{formatMoneyWithSymbol(dpriceFrom)} - {formatMoneyWithSymbol(dpriceTo)}</span>
              :
              <span className={classNameValue}>{formatMoneyWithSymbol(dpriceTo)} - {formatMoneyWithSymbol(dpriceFrom)}</span>

            }
          </ShowWrap>
        </div>
    </div>
  );
}


/*
  * Ref: PriceDisplay.xlsx
  * I had to include this block 2 times one for bonus and one for discount because we wanted
  * different ordering for both offerTypes
  * Will show L39 - IF PPA Then ... TO L41 -   IF Bonus: leave this line blank
  * L19 -   IF Bonus: ●  [Offer Description] (No need for "Offer:")
*/
function OfferDescripton(props) {
  const {offerDescription, show=false } = props
  if(!show) return null
  return (
    <div className="Comp_OfferDescripton">
      {offerDescription}
    </div>
  );
}

// export default PriceBlock
export {
  PriceBlock,
  OfferDescripton,
  PpaPriceBlock,
  PpaPriceAfterDiscount
}