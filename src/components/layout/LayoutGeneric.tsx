import React from "react";
import classNames from 'classnames'
import { getPlugin } from '@kookjs-client/core'
import Auth from '@kookjs-client/auth'
import { LayoutProps } from '../../types'
import Header from '../common/HeaderGeneric'
// import Footer from '../common/Footer'

export default (props: LayoutProps) => {
  const { className } = props
	const auth = getPlugin(Auth)
	const cssClass = classNames(className, {'isLoggedIn' : auth.isUserLoggedIn()} )

	return (
		<div id="layout" className={cssClass}>
			<Header />
			<div className="main">
					{props.children}
			</div>
			{/* <Footer />  */}
		</div>
	);
}