import React, { ReactChild, ReactChildren, Fragment } from 'react';

import { getPlugin } from '@kookjs-client/core'
import Auth from '..'

interface Props { 
  children?: ReactChild | ReactChild[] | ReactChildren | ReactChildren[]
}

export default (props: Props) => {
  const auth = getPlugin(Auth)
  if(auth.isUserLoggedIn()) return null

  return (
    <Fragment>
      {props.children}
    </Fragment>
  );
}