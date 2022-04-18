import React, { Fragment } from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { getPlugin } from '@kookjs-client/core'
import Auth from '@kookjs-client/auth'
import Authenticate from '@kookjs-client/auth/components/Authenticate'
import AuthenticatePublic from '@kookjs-client/auth/components/AuthenticatePublic'
import { getAppConfig } from "../../contants";
import ProfileDropdown from './ProfileDropdown'
import ButtonOutline from './ButtonOutline'

function Header() {
	const auth = getPlugin(Auth)
	const appConfig = getAppConfig();

	const token = auth.getToken()
	let dashLoginLink =  appConfig.domainSeller + "/login?token=" + token
	
	return (
		<Fragment>
			<header className="headerUser">
				<div className="headerUser_inner">
					<div className="left">
						<Link to={'/'} key="nav4"><img className="imgLogo" src={appConfig.logoUrl} /></Link>
					</div>
					<div className="right d-flex align-items-center">
						<ButtonOutline href={appConfig.domainInfoSite} external={true} target={"_blank"} title="About UXM" icon="fal fa-info-circle" />
						<AuthenticatePublic>
							<ButtonOutline href="/login?redirect=/" title="Login" icon="fal fa-sign-in-alt" />
							<ButtonOutline href="/join_prosper" title="Be a Part of It Join Free" icon="fal fa-user-plus" />
						</AuthenticatePublic>
						<Authenticate>
							<ButtonOutline href={dashLoginLink}  external={true} target={"_blank"} title="Dashboard" icon="fal fa-external-link-alt" />
							<ProfileDropdown />
						</Authenticate>

						<Link to={"/carts"} className="ms-2">
							<i className={"fal fa-shopping-cart"}></i>
						</Link>
					</div>
				</div>
			</header>
		</Fragment>
	);
}

export default Header