import React from "react";
import { isEventCookieExists } from "@kookjs-client/uxm"

export default (props: {show: boolean}) => {
  const { show } = props
  if(!show) return null;

  const isEvent = isEventCookieExists()
	return (
    <div className="d-none d-md-none d-lg-block adbanner">

      {
        isEvent ? 
        <div></div>
        :
        <div>
          <a className="d-block mb-5" target="_blank" href="https://www.theuxm.com/item/edenpure-r-uv-c-guardian-light-fed7b68d-ef16-4b5d-bc96-30ead573e9ba">
            <img src="https://cdn.theuxm.com/banners/edenpure-guardian.jpg" />
          </a>

          <a className="d-block mb-5" target="_blank" href="https://www.theuxm.com/item/edenpure-r-gen40-heater-c8773239-fd42-4351-a6ba-e53bff3337d0">
            <img src="https://cdn.theuxm.com/banners/eden-pure-gen40.jpg" />
          </a>

          <a className="d-block mb-5" target="_blank" href="https://info.theuxm.com/featured">
            <img src="https://cdn.theuxm.com/banners/watches-80-peroff.jpg" />
          </a>

          <a className="d-block mb-5" target="_blank" href="https://info.theuxm.com/featured5">
            <img src="https://cdn.theuxm.com/banners/save-on-healthy-food.jpg" />
          </a>

          <a className="d-block mb-5" target="_blank" href="https://www.theuxm.com/catalogue?s=safety">
            <img src="https://cdn.theuxm.com/banners/save-on-security-safety.jpg" />
          </a>

          <a className="d-block mb-5" target="_blank" href="https://info.theuxm.com/featured3">
            <img src="https://cdn.theuxm.com/banners/save-on-health-beauty.jpg" />
          </a>

          <a className="d-block mb-5" target="_blank" href="https://info.theuxm.com/featured2">
            <img src="https://cdn.theuxm.com/banners/save-on-bestsellers.jpg" />
          </a>

          <a className="d-block mb-5" target="_blank" href="https://info.theuxm.com/featured4">
            <img src="https://cdn.theuxm.com/banners/save-on-vitamins.jpg" />
          </a>	
        </div>
      }
    </div>
	);
};