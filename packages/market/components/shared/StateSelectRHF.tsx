import React, { useEffect, useState, useRef, lazy } from "react";
import { Controller, Control } from "react-hook-form";
import { useApolloClient } from "@apollo/client";
// import ReactSelect from "react-select";
const ReactSelect = lazy(() => import("react-select"));
import dotObject from "@khanakiajs/dot-object";

import { QUERY_GEO_STATES } from "../user/query";
import { Loading } from "@kookjs-client/core/components/shared/Loading";

export default (props: { name: string; control: Control<any>; setValue: any, rules?: any, countryId: any, onChange?: Function }) => {
	const { name, control, setValue, rules, countryId, onChange } = props;
	const [items, setItems] = useState([]);
	const client = useApolloClient();
	const loadingEl = useRef<any>();

	const fetchList = async (id) => {
		if(!id) return false
		loadingEl.current.show()
		const result = await client.query({
			query: QUERY_GEO_STATES,
			variables: {
				input: {
					"countryId": id
				}
			}
		});
		const list = dotObject.getArrayValue(result, ["data", "states", "items"], []);
		let items = [];
		for (let value of list) {
			// console.log(value)
			items.push({
				value: value.id,
				label: value.name,
			});
		}

		setItems(items);
	
		loadingEl.current ? loadingEl.current.hide() : null;
	};

	useEffect(() => {
		fetchList(countryId);
		// setValue(name, null, {
		// 	shouldValidate: false,
		// 	shouldDirty: true
		// })
	}, [countryId]);

	const handleSelectChange = (selected, onConrollerChange) => {
		// console.log(selected);
		onConrollerChange(selected.value);
		if (typeof onChange == "function") {
			onChange(selected.value);
		}
	};

	const getSelected = (id) => {
		let record = items.find((o) => o.value === id);
		// console.log("record", record)
		if (!record) {
			record = {
				label: null,
				value: null
			}
		}
		return record;
	};
	
	return (
		<React.Fragment>
			<Loading ref={loadingEl} overlay />
			<Controller
				name={name}
				// isClearable
				control={control}
				defaultValue={""}
				rules={rules}
				render={({ field: {onChange, onBlur, value} }) => {
					// console.log("sdfds", value);
					let selected = getSelected(value);

					return (
						<ReactSelect value={selected} defaultValue={selected} options={items} onChange={(selected) => handleSelectChange(selected, onChange)} />
					);
				}}
			/>
		</React.Fragment>
	);
};
