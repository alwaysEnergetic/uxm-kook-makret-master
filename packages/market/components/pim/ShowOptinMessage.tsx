import React, { useEffect } from 'react'
import qs from 'query-string';

export default function ShowOptinMessage(props) {
  useEffect(() => {
    const parsed = qs.parse(window.location.search);
    // console.log(parsed)
    if(parsed.optin && parsed.optin=='true') {
      toastr.success("You have successfully subscribed for free to the UXM newsletter of discounts, savings, and coupons");
    } 
    if(parsed.optin && parsed.optin=='false') {
      toastr.success("You have successfully un-subscribed for free to the UXM newsletter of discounts, savings, and coupons");
    }
  }, [])

  return null
}