import React, { useEffect, useState, useRef, lazy } from "react";
import { Controller, Control } from "react-hook-form";
import { useApolloClient } from "@apollo/client";
// import ReactSelect from "react-select";

const ReactSelect = lazy(() => import("react-select"));

import dotObject from "@khanakiajs/dot-object";

import { QUERY_GEO_COUNTRIES } from "../user/query";

export default (props: { name: string; control: Control<any>; rules?: any, onChange?: Function }) => {
	const { control, onChange, rules, name } = props;
	const [items, setItems] = useState([]);
	const client = useApolloClient();

	const fetchList = async () => {
		const result = await client.query({
			query: QUERY_GEO_COUNTRIES,
		});
		const list = dotObject.getArrayValue(result, ["data", "geo_countries", "items"], []);
		let items = [];
		for (let value of list) {
			// console.log(value)
			items.push({
				value: value.id,
				label: value.name,
			});
		}

		setItems(items);
	};

	useEffect(() => {
		fetchList();
	}, []);

	// let countries = [];
	// countries.push({
	// 	value: 1,
	// 	label: "Test",
	// });

	// countries.push({
	// 	value: 2,
	// 	label: "Test2",
	// });

	const handleSelectChange = (selected, onConrollerChange) => {
		console.log(selected);
		onConrollerChange(selected.value);
		if (typeof onChange == "function") {
			onChange(selected.value);
		}
	};

	const getSelected = (id) => {
		let record = items.find((o) => o.value === id);
		return record;
	};

	return (
		<React.Fragment>
			<Controller
				name={name}
				// isClearable
				control={control}
				defaultValue={""}
				rules={rules}

				render={({ field: {onChange, onBlur, value} }) => {
					// console.log(value);
					let selected = getSelected(value);

					return (
						<ReactSelect value={selected} defaultValue={selected} options={items} onChange={(selected) => handleSelectChange(selected, onChange)} />
					);
				}}
			/>
		</React.Fragment>
	);
};
