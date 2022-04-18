import React, { useState, useRef, useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom'
var classNames = require('classnames');

import { PriceBlock, OfferDescripton, PpaPriceBlock, PpaPriceAfterDiscount } from './PriceBlock'
import {TxType}  from '../constant'

import Image from "@kookjs-client/core/components/shared/Image";
import ShowWrap from "@kookjs-client/core/components/shared/ShowWrap";
import dotObject from "@khanakiajs/dot-object";
import { ListItem } from "../constant"

type TItemList = {
  items?: Array<ListItem>
  debug?: boolean
  anchorTarget?: string
  className?: string
  searchText?: string
}

function ItemList(props: TItemList) {
  const { items = [], debug=false, anchorTarget="", className='', searchText=null } = props
  if (items.length <= 0) return null
  
  const className_ = classNames("ItemListComp", className)

  return (
    <div className={className_}>
      {items.map((item, i) => {
        let { title, slug, shortDesc, subTitle, noIndex  } = item
        // const attachmentUrls = Sapp.Util.objValue(item, ['attachmentUrls'], [])

        // console.log("ITEM", JSON.stringify(item))
        const fileUrls = dotObject.getArrayValue(item, ["images"], []);

        
        let featuredImage = fileUrls.length >= 1 ? fileUrls[0]['url'] : false
        // console.log(featuredImage)
        
        // console.log(noIndex)
        const aRel = noIndex ? 'nofollow' : '';

        // console.log("item.offerValue", item)
  
        return (
          <div key={i} className="blockProperty" data-id={item.id}>
            <div className="left">
              {featuredImage ?
                <Image image={featuredImage} className="productImg" />
                :
                <Image image={APP_CONFIG.domainCdn + '/noimage.jpg'} className="productImg" />
                
              }
            </div>
            <div className="right">
              <div className="topWrapper">
                <h2 className="title"><Link target="_blank" rel={aRel} to={'/item/' + slug}>{title}</Link></h2>
                {subTitle ? <div className="subTitle font-weight-bold mb-2">{subTitle}</div> : null}
                <div className="shortDescription mb-2">{shortDesc}</div>
  
              </div>
              <div className="bottomWrapper">
                <div className="top">
                  <OfferDescripton 
                    offerDescription={item.offerDesc}
                    show={item.offerType=='bonus'}
                  />
  
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
  
                  <OfferDescripton 
                    offerDescription={item.offerDesc}
                    show={item.offerType=='discount'}
                  />

                  <ShowWrap show={item.txTypeId==TxType.B2B_RFP}>
                    <div className="b2b-button">B2B Request Quote</div>
                  </ShowWrap>
                </div>
                <div className="bottom">
                  <Link target={anchorTarget} rel={aRel} className="btn btn-outline-primary btn-sm readMoreBtn" to={`/item/${slug}?s=${searchText}`}>Read More</Link>
                </div>
              </div>
  
              <ShowWrap show={debug}>
                <div className="debug">
                  <div>OfferType: {item.offerType}</div>
                  <div>OfferValueMode: {item.offerValueMode}</div>
                  <div>PriceMode: {item.priceMode}</div>
                  <div>TxType: {item.txTypeId}</div>
                </div>
              </ShowWrap>
  
            </div>
          </div>
        )
      })}
    </div>
  )
}


export default ItemList