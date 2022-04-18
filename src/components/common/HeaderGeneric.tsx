import React, { Fragment } from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { getPlugin } from '@kookjs-client/core'
import Auth from '@kookjs-client/auth'
import { getAppConfig } from "../../contants";
import qs from "query-string";

function Header() {
	const qparam = qs.parse(window.location.search);
	const hideNav = qparam.hideNav ? true : false;
	if(hideNav) return null

	const auth = getPlugin(Auth)
	const appConfig = getAppConfig();

	const token = auth.getToken()
	// let dashLoginLink =  appConfig.domainSeller + "/login?token=" + token
	
	return (
		<Fragment>
			<header className="headerUser">
				<div className="headerUser_inner">
					<div className="left">
						<Link to={'/'} key="nav4"><img className="imgLogo" src={appConfig.logoUrl} /></Link>
					</div>
				</div>
			</header>
		</Fragment>
	);
}

export default Header