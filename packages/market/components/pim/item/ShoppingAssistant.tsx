import React, { Fragment, useState, useRef, useEffect } from "react";
import { Link, LinkProps } from 'react-router-dom'
import classNames from 'classnames'
import { getGlobalVariable, getPlugin } from "@kookjs-client/core";
import { getEnquiryButtonLabel, canEnquiryButtonShowFn } from "../function";

import { ItemAttributes, Item as TItem } from "../constant"

type TShoppingAssistant = {
  attribs: ItemAttributes[]
  brand?: string
  itemCategoryName: string
  suggestionKeyword: string
  className?: string
}

function getAttribute(key: string, attibs: ItemAttributes[]): ItemAttributes {
  return (attibs||[]).find((attrib) => attrib.key == key)
}

export default (props : TShoppingAssistant) => {
	const { attribs, brand, itemCategoryName, suggestionKeyword, className } = props;
  const [isSticky, setSticky] = useState(false);
  const [stickyOffset, setStickyOffset] = useState(0);
  const [offsetTop, setOffsetTop] = useState(0);
  const [scrollDown, setScrollDown] = useState(false);

  const ref = useRef(null);
  const globalVar = getGlobalVariable()

  const handleScroll = () => {
    // if (ref.current) {
    //   // console.log(ref.current.getBoundingClientRect().top)
    //   // setSticky(ref.current.getBoundingClientRect().top <= 0);
    //   if(ref.current.getBoundingClientRect().top <= 0 && !isSticky) {
    //     setSticky(true)
    //     // setStickyOffset(globalVar.window.pageYOffset)
    //   } 
    //   console.log("istSticky", isSticky)
      
    //   // console.log("globalVar.window.pageYOffset <= stickyOffset", globalVar.window.pageYOffset <= stickyOffset)
    //   // if(globalVar.window.pageYOffset <= stickyOffset && isSticky) setSticky(false)
    // }

    setOffsetTop(globalVar.window.pageYOffset)
  };

  useEffect(() => {
    if(globalVar.window.innerWidth < 1200) return
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', () => handleScroll);
    };
  }, []);


  useEffect(() => {
    if(!ref.current) return
    
    // console.log(ref.current.getBoundingClientRect().top)
    if(ref.current.getBoundingClientRect().top <= -600 && !isSticky) {
      setSticky(true)
      setStickyOffset(offsetTop)
      setTimeout(() => setScrollDown(true), 100)
    }

    if(offsetTop <= stickyOffset && isSticky) {
      setSticky(false)
      setScrollDown(false)
    }
  }, [offsetTop])


	const className_ = classNames("ShoppingAssistant blockInfo", {'isSticky': isSticky, 'scrollDown': scrollDown});
  const attrib = getAttribute("Brand", attribs)

  let brandName = brand || attrib?.value

	return (
		<Fragment>
			<div className={className_} ref={ref}>
        <h6>Your UXM Shopping Assistant</h6>

        <ul>
          <li>See More <Link to={`/catalogue?s=${itemCategoryName}`}>{itemCategoryName}</Link></li>
          { brandName ? <li>See More <Link to={`/catalogue?s=${brandName}`}>{brandName}</Link></li> : null }
          { suggestionKeyword ? <li>See <Link to={`/catalogue?s=${suggestionKeyword}`}>More Like This</Link></li> : null }
          <li>See What's <Link to={'/catalogue'}>New</Link></li>
        </ul>

        <form action="/catalogue">
          <div className="input-group input-group-sm mb-3">
            <input type="text" className="form-control" placeholder="Search" name="s" />
            <button className="btn btn-primary" type="submit">Search</button>
          </div>
        </form>
			</div>
		</Fragment>
	);
}
