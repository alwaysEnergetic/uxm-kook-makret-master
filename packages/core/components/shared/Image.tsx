import React, { useEffect, useState } from "react";

export default (props: {
	image?: string;
	maxWidth?: number;
	className?: string;
}) => {
	const { image, maxWidth, className } = props;
	const [status, setStatus] = useState("loading");

	const style: any = {};
	if (maxWidth) style.maxWidth = maxWidth;

	const onError = (e) => {
		e.target.src = "https://cdn.theuxm.com/noimage.jpg";
		e.target.style = `max-width: ${maxWidth}px; margin: 0px;`;
		// setStatus("error");
	};

	const onLoad = () => {
		setStatus("loaded");
	};

	useEffect(() => {
		setStatus("loading");
	}, [image])

	let loadingImageUrl = "https://cdn.theuxm.com/loading.gif"
	let url = status=='loading' ? loadingImageUrl :  image
	// url = status=='error' ? "https://cdn.theuxm.com/noimage.jpg" :  url

	return (
		<React.Fragment>
			<img
				src={url}
				onError={onError}
				onLoad={onLoad}
				style={style}
				className={className}
			/>
		</React.Fragment>
	);
};
