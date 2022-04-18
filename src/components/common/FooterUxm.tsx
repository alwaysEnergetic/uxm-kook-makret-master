import React from "react";
import { getAppConfig } from "../../contants";
export default function Footer() {
	var d = new Date();
	var n = d.getFullYear();

	const appConfig = getAppConfig();
	const url = appConfig.domainInfoSite

	return (
		<footer>
			<div className="outer">
				<div className="left">
					<a href={`${url}/help/`} target="_blank">Help</a>
					<span className="divider divider-vertical"></span>
					<a href={`${url}`} target="_blank">About</a>
					<span className="divider divider-vertical"></span>
					<a href={`${url}/privacy/`} target="_blank">Privacy Policy</a>
					<span className="divider divider-vertical"></span>
					<a href={`${url}/contact/`} target="_blank">Contact Us</a>
					<span className="divider divider-vertical"></span>
					<a href={`${APP_CONFIG.domain}/catalogue/`} >Catalogue</a>
					<span className="divider divider-vertical"></span>
					<a href={`${url}/grow-business-lp2/`} target="_blank">Grow Your Business With The UXM</a>
					
				</div>
				<div className="right">
					{`Copyright © ${n} ${appConfig.appName}`}
				</div>
			</div>
		</footer>
	);
}