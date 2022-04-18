import React, { useState } from "react";
var classNames = require("classnames");
import ShowWrap from "@kookjs-client/core/components/shared/ShowWrap";

function ItemTitleBlock(props) {
	const { className, title, subTitle } = props;

	const className_ = classNames("compItemTitleBlock", className);

	return (
		<div className={className_}>
			<h2 className="title">{title}</h2>

			<ShowWrap show={subTitle}>
				<div className="subTitle font-weight-bold">{subTitle}</div>
			</ShowWrap>

			{/* {item.sellerBusinessName ? 
          <div>by <span style={{color: 'blue'}}> {item.sellerBusinessName}</span></div>
          : null }
      <Breadcrumb separator=">" className="mt-2">
          {itemCategoriesHierarchy.map((itemCategory)=> {
              return (
                  <Breadcrumb.Item key={itemCategory._id}>{itemCategory.title}</Breadcrumb.Item>
              )
          })}
      </Breadcrumb> */}
		</div>
	);
}

export default ItemTitleBlock;
