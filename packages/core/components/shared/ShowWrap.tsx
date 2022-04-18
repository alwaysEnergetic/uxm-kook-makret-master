import React, { Fragment, useEffect, useState } from 'react';

interface ShowWrapProps {
  show: boolean;
  children?: any
}

function ShowWrap(props: ShowWrapProps) {
  const { show } = props
  const [shown, setShown] = useState(show)
  // if(!show) return null

  useEffect(() => {
    setShown(show)
  }, [show])

  if(!shown) return null

  return (
    <Fragment>
      {props.children}
    </Fragment>
  );
}

export default ShowWrap