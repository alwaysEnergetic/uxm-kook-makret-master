import React, { useState, useImperativeHandle, forwardRef, Ref, useEffect } from 'react';

export interface LoadingElement {
  show: () => void
  hide: () => void
}

function LoadingFunc(props: {overlay?: boolean, show?: boolean}, ref: Ref<LoadingElement>) {
  const { overlay=false, show=false } = props
  const [visible, setVisible] = useState(show)

  useImperativeHandle(ref, () => ({
    show: () => {
      setVisible(true)
    },
    hide: () => {
      setVisible(false)
    }
  }));
  
  // If we pass the loading state as prop Toggle true|false then it should update the component
  useEffect(() => {
    setVisible(show)
  }, [show])
  
  if(!visible) return null

  return (
    <div className="LoadingComp">
      {overlay ? <div className="overlay"></div> : null}
      <div className="spinnerWrapper">
        {/* <div className="spinner-border text-primary-light" role="status">
          <span className="sr-only">Loading...</span>
        </div> */}
         <svg className="svgLoader" viewBox="0 0 100 100" width="5em" height="5em">
        <path stroke="none" d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#4099de" transform="rotate(179.719 50 51)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 51;360 50 51" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></path>
      </svg>
      </div>
    </div>
  );
}



export const Loading = forwardRef(LoadingFunc);

// export default Loading
// export default LoadingFunc