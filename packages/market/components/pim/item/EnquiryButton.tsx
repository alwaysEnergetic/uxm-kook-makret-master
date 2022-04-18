import React, { Fragment, useState, useRef, useEffect } from "react";
var classNames = require("classnames");

import { getEnquiryButtonLabel, canEnquiryButtonShowFn } from "../function";
import Modal from "@kookjs-client/core/components/shared/Modal";
import EnquiryForm from "./EnquiryForm";
import { Status } from "../constant"

function EnquiryButton(props) {
	const modal: any = useRef();

	const { statusId, txType, itemId, className } = props;
	const showEnquiryButton = canEnquiryButtonShowFn(txType);
	const enquriyBtnLabel = getEnquiryButtonLabel(txType);

	// console.log("showEnquiryButton", statusId)
	if (statusId!==Status.PUBLISHED || !showEnquiryButton) return null;

	const className_ = classNames("compEnquiryButton", className);

	function showEnquiryForm() {
		// console.log('show')
		modal.current.show();
	}

	function onEnquiryFormSubmit() {
		modal.current.hide();
	}

	// useEffect(() => {
	//   // modal.current.show()
	// })

	return (
		<Fragment>
			<div className={className_}>
				<button className="btn btn-sm btn-warning btn-block" onClick={showEnquiryForm}>
					{enquriyBtnLabel}
				</button>
			</div>

			<Modal isVisible={false} ref={modal}>
				<EnquiryForm txType={txType} itemId={itemId} onSubmit={onEnquiryFormSubmit} />
			</Modal>
		</Fragment>
	);
}

export default EnquiryButton;
