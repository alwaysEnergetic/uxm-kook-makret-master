import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
// import * as mobx from 'mobx';
// import dotObject from '@khanakiajs/dot-object'
import qs from 'query-string'

import { Helmet } from "react-helmet";

import { LayoutContainerProps } from './types'

// import LayoutDefault, { LayoutProps } from './components/common/LayoutDefault'
import { getPlugin } from '@kookjs-client/core'
// import { useSeoStore } from '@kookjs-client/seo/store'
import SeoHelmet from '@kookjs-client/seo/SeoHelmet'
import Auth from '@kookjs-client/auth'
import LayoutDefault from './components/layout/LayoutDefault'
import LayoutRaw from './components/layout/LayoutRaw'
import LayoutGeneric from './components/layout/LayoutGeneric'
import { getAppConfig } from './contants'

const Layouts = {
  default: LayoutDefault,
  raw: LayoutRaw,
  generic: LayoutGeneric
}

export default (props: LayoutContainerProps) => {
  const appConfig = getAppConfig()

  const { title=null, layoutName='default', authenticate='Any', roles=[], capabilites=[], layoutProps, ChildComponent } = props
  const auth = getPlugin(Auth)
	const history = useHistory()
	const [hasInit, setHasInit] = useState(false)
  
  // Will update on every route change if we run this only on Firsttime then this will work only on page load
  useEffect(() => {
    setHasInit(true)
    // console.log(authenticate)
      
    // if(authenticate=="Private" && !auth.isUserLoggedIn()) {
    //   history.push('/login?redirect=' + encodeURIComponent(location.pathname+location.search))
    // }
    
    // if(authenticate=="Public" && auth.isUserLoggedIn()) {
    //   const qparam = qs.parse(window.location.search);
    //   const redirect = qparam.redirect ? qparam.redirect.toString() : "/"
    //   history.push(redirect)
    // }
  })
  // const authenticate = dotObject.get(layoutProps, 'name', 'default')

  const LayoutComp = Layouts[layoutName]
  // console.log(layoutName)
  
  if (!hasInit) return null;

  // console.log(title)
  
  return (
    <React.Fragment>
      <SeoHelmet title={title} />
      <LayoutComp {...layoutProps}>
        <ChildComponent />
      </LayoutComp>
    </React.Fragment>
  )
}