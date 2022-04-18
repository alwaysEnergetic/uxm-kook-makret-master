import React from 'react'

export default function AntFormErrorsDisplay(props) {
	const { errors = [] } = props;
	// console.log(errors.constructor)
	
	if (Object.keys(errors).length === 0 && errors.constructor === Object) return null;
	return (
		<div className="AntFormErrorsDisplayComp">
			{Object.keys(errors).map((item, i) => {
				// console.log(item, i)
				return (
					<div key={Math.random()} className="error">
						{errors[item]["errors"][0]}
					</div>
				);
			})}
		</div>
	);
}
