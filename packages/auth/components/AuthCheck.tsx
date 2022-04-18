import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { getPlugin } from "@kookjs-client/core";
import Auth from "..";

export default function AuthCheck(props) {
  const history = useHistory();
	const auth = getPlugin(Auth);

	const postLoginEventToParent = (token: string) => {
		//Don't run unless in an iframe
		if (self !== top) {
			console.log("POST MESSAGE")
			window.parent.postMessage({action: "login", token: token}, '*');
		}
	}

	useEffect(() => {
    if(!auth.isUserLoggedIn()) {
      history.push(`/login?redirect=/auth/check`)
      return
    }
		const token = auth.getToken()
		postLoginEventToParent(token)
	}, []);


	return null
}
