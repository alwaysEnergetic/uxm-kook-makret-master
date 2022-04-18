import React, { useState, useRef, useEffect, useReducer } from 'react';
import { useApolloClient, ApolloError } from "@apollo/client";
import dotObject from "@khanakiajs/dot-object";
import { isEventCookieExists } from "@kookjs-client/uxm"
// import { fetchItemListPopular } from '../../api'
import { QUERY_ITEMS_REST } from '../query'

import ItemList from './ItemList'

function ItemPopularList() {
  const [ items, setItems ] = useState([])
  const client = useApolloClient();

  const fetchItems = (meta = {}, filters = {}) => {
    client
    .query({
      query: QUERY_ITEMS_REST,
      variables: {
        input: {
          meta: {
            limit: 4,
            extra: {
              isEvent: isEventCookieExists()
            }
          }
        }
      }
    })
    .then((res) => {
      // console.log(res);
      const items = dotObject.getArrayValue(res, ["data", "items", "items"], []);
     
      setItems(items)
    })
    .catch((err) => {
     
    })
    .finally(() => {});
  }

  useEffect(() => {
    fetchItems()
  }, [])

  return (
    <div className={'ItemPopularListComp'}>
      <h2>Popular Products</h2>
      <ItemList items={items} anchorTarget={'_blank'} className="vertical" />
    </div>
  );
}

export default ItemPopularList