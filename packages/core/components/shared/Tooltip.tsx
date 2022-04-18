import React, { Component } from "react";
import { Popover } from "antd";
// import { QuestionCircleOutlined } from "@ant-design/icons";

export function WrapContent(content, width="300px") {
	return <div style={{ maxWidth: width }} dangerouslySetInnerHTML={{__html: content }}>{}</div>;
}

export const Tooltip = (props: { content?: string; label?: string }) => {
	const { content, label } = props;
	return (
		<span className="Comp_ToolTip">
			{label ? <span className="text me-2">{label}</span> : null }

			{
				content ?
				<Popover content={WrapContent(content)}>
					<i className="fal fa-question-circle text-secondary" aria-hidden="true"></i>
				</Popover>
				: null
			}
		</span>
	);
};
