import React, { useEffect, useState, useRef } from "react";
import { Loading } from "@kookjs-client/core/components/shared/Loading";
import { isEventCookieExists } from "@kookjs-client/uxm"
import ItemList from "./item/ItemList";
import useItemsQuery, { ItemsQueryRequestParam, ItemsQueryResponse } from  './useItemsQuery'
import { ListItem } from "./constant"

/**
 * Infinite Scroll Ref. - https://dev.to/hunterjsbit/react-infinite-scroll-in-few-lines-588f
 */
export default (props: { searchText?: string, title?: string, skipIds?: Array<number>, className?: string }) => {
	const { className, title, searchText, skipIds=[] } = props

	// if(!searchText) return null

	// console.log(searchText)
	const [keyword, setKeyword] = useState(searchText);
	const [page, setPage] = useState(1);
	const [items, setItems] = useState<Array<ListItem>>([]);
	const loader = useRef(null);

	const useItemsQueryCallback = (resp: ItemsQueryResponse) => {
		// console.log("items", items)
		// console.log("resp.items", resp.items)
		const respItems = resp.items.filter((item) => skipIds.indexOf(item.id) == -1);
		// console.log("respItems", respItems)
		const newItems = [...items, ...respItems]
		// console.log("newItems", newItems)
		setItems(newItems)
		if(resp.items.length == 0) {
			setKeyword(null)
		}
		
		if(newItems.length == items.length) {
			loader.current.style.display = "none";
		}
	}

	const { doSearch, result, showSkeleton, noResultFound, loading } =
		useItemsQuery(useItemsQueryCallback);

	const doSearch_ = () => {
		let requestParam: ItemsQueryRequestParam = {
			meta: {
				page: page,
				limit: 10,
				extra: {
					searchText: keyword,
					isEvent: isEventCookieExists()
				},
			},
		};

		doSearch(requestParam);
	};

	
	useEffect(() => {
		var options = {
			root: null,
			rootMargin: "20px",
			threshold: 1.0,
		};
		// initialize IntersectionObserver
		// and attaching to Load More div
		const observer = new IntersectionObserver(handleObserver, options);
		if (loader.current) {
			observer.observe(loader.current);
		}
	}, []);


	// here we handle what happens when user scrolls to Load More div
	// in this case we just update page variable
	const handleObserver = (entities) => {
		const target = entities[0];
		if (target.isIntersecting) {
			setPage((page) => page + 1);
		}
	};

	useEffect(() => {
		doSearch_();
	}, [page, keyword]);

	// if(items.length == 0) return null
	// console.log("noResultFound", noResultFound, noResultFound && items.length == 0)
	// if(noResultFound && items.length == 0) return null

	return (
		<div className={"CatalogueComp " + className}>
			{title && items.length > 0 ? <h3 className="mb-3">{title}</h3> : null }
			<div className="row">
				<div className="col-12 col-md-12 col-lg-9">
					<div className="ItemsList">
						<ItemList items={items} anchorTarget={"_blank"} />
					</div>

					<div className="spinner-border text-secondary" ref={loader}></div>
				</div>
			</div>
		</div>
	);
};