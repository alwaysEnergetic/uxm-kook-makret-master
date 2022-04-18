import React, { Fragment } from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { getGlobalVariable, getPlugin } from '@kookjs-client/core'
import Auth from '@kookjs-client/auth'
import Authenticate from '@kookjs-client/auth/components/Authenticate'
import AuthenticatePublic from '@kookjs-client/auth/components/AuthenticatePublic'
import { getAppConfig } from "../../contants";
import ProfileDropdown from './ProfileDropdown'
import ButtonOutline from './ButtonOutline'

function Header() {
	const auth = getPlugin(Auth)
	const appConfig = getAppConfig();
	const userUID = auth.getUserUID()

	const handleLogoClick = () => {
		window.location.href = appConfig.domainInfoSite + "/event-home"
	}

	return (
		<Fragment>
			<header className="headerUser event">
				<div className="headerUser_inner">
					<div className="left">
						<a href={appConfig.domainMusic} onClick={handleLogoClick} key="nav4"><img className="imgLogo" src={'/images/logo-event.png'} /></a>
					</div>
					<div className="right d-flex align-items-center">
						<ButtonOutline href={appConfig.domainMusic + "/groups"} external={true} target={"_blank"} title="Programs" icon="fal fa-user-friends" />
						<ButtonOutline href={appConfig.domainMusic + "/connect"} external={true} target={"_blank"} title="Connect" icon="fal fa-link" />

					{/* 						
						<AuthenticatePublic>
							<ButtonOutline external={true} href={appConfig.domainInfoSite + "/login"} title="Login" icon="fal fa-sign-in-alt" />
						</AuthenticatePublic> */}

						<Authenticate>
							{/* <ButtonOutline href={`/catalogue/?sellerUid=${userUID}&previewId=4d056c89-ef8b-4c87-9949-7968ee94363c`} title="Profile" icon="fal fa-user-plus" /> */}
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