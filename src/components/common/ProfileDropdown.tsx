import React from "react";
import { Link, useHistory } from "react-router-dom";
import { getPlugin } from "@kookjs-client/core";
import Auth from "@kookjs-client/auth";

export default function ProfileDropdown(props) {
	const auth = getPlugin(Auth);

	const history = useHistory();

	function logout(e) {
		e.preventDefault();
		auth.logout();
		history.push("/login");
	}

	return (
		<div className="dropdown">
			{/* <span className="me-2">{auth.getUserEmail()}</span> */}
			<a href="#" className="dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				<i className="far fa-user"></i>
				<i className="fa fa-chevron-down ms-1 fs-10"></i>
			</a>
			<div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
				<div className="dropdown-header">
					{auth.getUserEmail()}
				</div>
				<Link className="dropdown-item" to={"/auth/forgot_password"}>
					Change Password
				</Link>
				<a className="dropdown-item" href="https://info.theuxm.com/contact/" target="_blank">
					Contact us
				</a>
				<a className="dropdown-item" href="#" onClick={logout}>
					Sign Out
				</a>
			</div>
		</div>
	);
}