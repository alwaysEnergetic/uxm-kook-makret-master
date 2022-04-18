import React from 'react'
import { Link } from 'react-router-dom'

export default (props: {title:string, href:string, icon: string, target?:string, external?:boolean}) => {
	const { title, href, icon, external=false, target ="_self" } = props
	return (
		<React.Fragment>
		{external?
			<a 
			target={target}
			className="btn btn-outline-primary btn-sm me-2" href={href} key="nav2">
				<span className="d-none d-sm-block">{title}</span>
				{icon ? <span className=" d-block d-sm-none"><i className={icon}></i></span> : null }
			</a>
			:
		<Link 
		target={target}
		className="btn btn-outline-primary btn-sm me-2" to={href} key="nav2">
			<span className="d-none d-sm-block">{title}</span>
			{icon ? <span className=" d-block d-sm-none"><i className={icon}></i></span> : null }
		</Link>
		}
		</React.Fragment>
	)
}