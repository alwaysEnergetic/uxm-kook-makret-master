import React, { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router";

import { Helmet } from "react-helmet";
import { useApolloClient, ApolloError, useQuery, useLazyQuery, useMutation, gql } from "@apollo/client";


import { Loading } from "@kookjs-client/core/components/shared/Loading";
import ShowWrap from "@kookjs-client/core/components/shared/ShowWrap";
import LineBreak from "@kookjs-client/core/components/shared/LineBreak";

import { QUERY_ADDRESS_LIST_FULL_REST } from "../address/query";
import { KookErrorParser } from "@kookjs-client/core";
import dotObject from "@khanakiajs/dot-object";

export default () => {
	const loadingEl = useRef<any>();
	const [items, setItems] = useState<any>([]);
	
	const history = useHistory();
	const client = useApolloClient();

	const fetchAddresses = () => {
		client
			.query({
        query: QUERY_ADDRESS_LIST_FULL_REST,
        variables: {
          input: {}
        }
			})
			.then((response) => {
				// console.log(response)
				const data = dotObject.getArrayValue(response, ["data", "addressListFull", "items"], []);
				// console.log(data)
				setItems(data);
			})
			.catch((err: ApolloError) => {
				const errorParser = new KookErrorParser(err);
				toastr.error(errorParser.message);
			})
			.finally(() => {
				loadingEl.current ? loadingEl.current.hide() : null;
			});
  };
  
  const setShippingAddress = (id) => {
    // console.log(id)
  }

	useEffect(() => {
		fetchAddresses();
	}, []);

	return (
    <React.Fragment>
      <Loading ref={loadingEl} overlay />
      <div className="AddressSelector">
        <ul className="list-group">
          {items.map((item, i) => {
            return (
              <li className="list-group-item" key={i}>
                <label>
                  <input type="radio" onClick={() => setShippingAddress(item.id)} />
                  <span className="ms-2">{item.fullAddress}</span>
                </label>
              </li>
            )
          })}

        </ul>
      </div>
    </React.Fragment>
	);
}
