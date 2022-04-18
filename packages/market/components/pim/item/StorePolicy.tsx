import React, { Fragment, useState, useRef, useEffect } from "react";
import { useApolloClient } from "@apollo/client";
import dotObject from "@khanakiajs/dot-object";
import Modal from "@kookjs-client/core/components/shared/Modal";
import LineBreak from "@kookjs-client/core/components/shared/LineBreak";
import { queryStorePolicy } from "../query";
import { isUUIDEmpty } from "@kookjs-client/util"

export default(props: {policyId: number}) => {
	const { policyId } = props;

	const modal: any = useRef();

	if (isUUIDEmpty(policyId)) return null;

  const client = useApolloClient();
  const [item, setItem] = useState<any>();

	const fetchItem = async () => {
		const response = await client.query({
			query: queryStorePolicy,
			fetchPolicy: "network-only",
			variables: {
        id: policyId,
      },
		});

		const item = dotObject.getArrayValue(response, ["data", "queryStorePolicy"], {});
		setItem(item);
	};

	useEffect(() => {
		fetchItem();
	}, []);

	function showModal() {
		modal.current.show();
	}

  console.log(item)

	return (
		<Fragment>
			<div>
				<button className="btn btn-link p-0 fs-14" onClick={showModal}>
					{item?.displayName}
				</button>
			</div>

			<Modal isVisible={false} ref={modal} title={item?.displayName}>
        <LineBreak text={item?.descr} />
			</Modal>
		</Fragment>
	);
}