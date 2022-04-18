import React, { useState } from 'react';
import dotObject from "@khanakiajs/dot-object";
import {NOIMAGE_URL} from '../constant'
import classNames from 'classnames'

function ItemCarouselBlock(props) {
	const { className, images = [] } = props;
	const className_ = classNames("compItemCarouselBlock", className);
	const [currentIdx, setCurrentIdx] = useState(0)
	const imagesList = dotObject.getArrayValue(images, [], []);

	const handleImageClick = () => {
		let images = [];

		if (images.length == 0) {
			for (let image of imagesList) {
				images.push({
					src: image.url,
				});
			}
		}
		jQuery.fancybox.open(images, {}, currentIdx);
	};

	const getCurrentImageUrl = () => {
		const url = dotObject.getArrayValue( images, [currentIdx, "url"], NOIMAGE_URL );
		return url
	}

	return (
		<div className={className_}>
			<div className="imgBlock">
				<img src={getCurrentImageUrl()} onClick={handleImageClick} />
			</div>

			<div className="imageList">
				{imagesList.map((image, i) => {
					const isActive = currentIdx == i;
					const className = classNames("imageWrap", { active: isActive });
					return (
						<div
							className={className}
							key={i}
							onClick={() => setCurrentIdx(i)}
							onMouseEnter={() => setCurrentIdx(i)}
						>
							<img src={image["url"]} />
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default ItemCarouselBlock;