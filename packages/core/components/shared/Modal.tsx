import React, { Fragment, forwardRef, useRef, useEffect, useImperativeHandle, useState } from 'react';
import classNames from "classnames";

import Portal from './Portal'

export type TModal = {
  children: React.ReactElement
  className?: string
  classDialog?: string
  title?: string
  isVisible?: boolean
  onOk?: () => void
  onCancel?: () => void
}

const Modal_ = (props: TModal, ref) => {
  const { children, className, classDialog, title=null, isVisible=false, onOk, onCancel } = props
  // const {visible, setVisible} = useState(false)

  const modalEl = useRef(null);
  const [show, setShow] = useState(isVisible)
  // useEffect(() => {
  //   // jQuery(modalEl.current).modal('show')
  //   // console.log(modalEl)
  // }, [])

  useImperativeHandle(ref, () => ({
    get: () => {
      return jQuery(modalEl.current)
    },
    show: () => {
      // var $modal: any = jQuery(modalEl.current)
      // $modal.modal('show')
      setShow(true)
      if(typeof onOk == "function") {
        onOk()
      }
    },
    hide: () => {
      // jQuery(modalEl.current).modal('hide')
      // var $modal: any = jQuery(modalEl.current)
      // $modal.modal('hide')
      setShow(false)
      if(typeof onCancel == "function") {
        onCancel()
      }

    }
  }));
  

  useEffect(() => {
    // var $modal: any = jQuery(modalEl.current)
    if(!modalEl.current) return
    jQuery(modalEl.current).on('hidden.bs.modal', function (event) {
      setShow(false)
       if(typeof onCancel == "function") {
        onCancel()
      }
    })    
  }, [])

  useEffect(() => {
    setShow(isVisible)
    // console.log("isVisible", isVisible)
    // var $modal: any = jQuery(modalEl.current)
    // if(isVisible) {
    //   $modal.modal('show')
    // } else {
    //   $modal.modal('hide')
    // }
  }, [isVisible])

  useEffect(() => {
    var $modal: any = jQuery(modalEl.current)
    if(show) {
      $modal.modal('show')
      console.log("SHOW")
    } else {
      $modal.modal('hide')
    }
  }, [show])
  
  // console.log("show", show)
  // if(!show) return null

  // console.log(show)
  const className_ = classNames("modal fade ModalComp", className)

  return (
    <Fragment>
      <Portal id={"modalPortal_" + Math.floor((Math.random() * 10) + 1)}>
        
        <div className={className_} tabIndex={-1} role="dialog" ref={modalEl}>
        <div className={"modal-dialog modal-dialog-centered " + classDialog} role="document">
          <div className="modal-content">
          {
            title ? 
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShow(false)}></button>
            </div>
            : 
            <button type="button" className="btn-close close notitle" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShow(false)}></button>
          }  
            <div className="modal-body">
              {children}
            </div>
          </div>
        </div>
      </div>
      </Portal>
    </Fragment>
  );
}

const Modal = forwardRef(Modal_);

export default Modal