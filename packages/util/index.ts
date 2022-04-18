import { getGlobalVariable, getPlugin } from "@kookjs-client/core";
// https://github.com/electerious/key-value-replace
export const parseTemplate = (str: string, data, delimiter = ["{{", "}}"]) => {
	// var re = /\{{(.*)\}}/i;
	var re = /{{([^}]+)}}/gi;
	// var str1 = "a {string} with {curly} braces"
	// console.log(re.exec(str1))
	let found = [];
	let curMatch;
	while ((curMatch = re.exec(str))) {
		found.push(curMatch[1]);
	}
	// console.log(found)
	found.forEach((key) => {
		// console.log(key)
		let _key = key.trim();
		str = str.replace(`{{${key}}}`, data[_key]);
	});

	return str;
};

export function sortBy(collection, key) {
	function compare(a, b) {
		// console.log(a)

		a[key] = a[key] ? a[key].toString() : "";
		b[key] = b[key] ? b[key].toString() : "";
		// if (!a[key]) a[key] = ""
		// if (!b[key]) b[key] = ""
		// Use toUpperCase() to ignore character casing
		const bandA = a[key].toUpperCase();
		const bandB = b[key].toUpperCase();

		let comparison = 0;
		if (bandA > bandB) {
			comparison = -1;
		} else if (bandA < bandB) {
			comparison = 1;
		}
		return comparison;
	}

	return collection.sort(compare);
}

// https://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-dollars-currency-string-in-javascript
// (123456789.12345).formatMoney(2, ".", ",");
export function formatMoney(n: any, c?, d?, t?) {
	var c = isNaN((c = Math.abs(c))) ? 2 : c,
		d = d == undefined ? "." : d,
		t = t == undefined ? "," : t,
		s = n < 0 ? "-" : "",
		i: any = String(parseInt((n = Math.abs(Number(n) || 0).toFixed(c)))),
		j = (j = i.length) > 3 ? j % 3 : 0;

	return (
		s +
		(j ? i.substr(0, j) + t : "") +
		i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
		(c
			? d +
			  Math.abs(n - i)
					.toFixed(c)
					.slice(2)
			: "")
	);
}

export function formatMoneyWithSymbol(amount, symbol = "US$") {
	let newAmount = formatMoney(amount);
	let result = symbol ? symbol + newAmount : parseFloat(newAmount);
	return result;
}

export const grecaptchaExecute = () => {
	return new Promise(function (resolve, reject) {
		let gvar = getGlobalVariable();
		gvar.grecaptcha.ready(function () {
			gvar.grecaptcha.execute(APP_CONFIG.recaptchaSiteKey, { action: "action_name" }).then(function (token) {
				// console.log(token)
				// Verify the token on the server.
				resolve(token);
			});
		});
	});
};

export function uuid() {
	var chars = "0123456789abcdef".split("");

	var uuid = [],
		rnd = Math.random,
		r;
	uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
	uuid[14] = "4"; // version 4

	for (var i = 0; i < 36; i++) {
		if (!uuid[i]) {
			r = 0 | (rnd() * 16);

			uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r & 0xf];
		}
	}

	return uuid.join("");
}


export interface LoadScriptProps {
	src: string;
	id?: string;
  callback?: Function;
}

export function loadScript(props: LoadScriptProps) {
	let { src, id, callback } = props

	if (!id) {
		id = "s-"+uuid()
	}

  const existingScript = document.getElementById(id);
  if (!existingScript) {
    const script = document.createElement('script');
    script.src = src;
    script.id = id;
    document.body.appendChild(script);
    script.onload = () => { 
      if (callback) callback();
    };
  }
  if (existingScript && callback) callback();
};


export function datalayerPush(data: any) {
	if (typeof getGlobalVariable().dataLayer !== "undefined" && APP_CONFIG.env == "production") {
		getGlobalVariable().dataLayer.push(data);
	}
}

/**
 * Will return:
 * False for: for all strings with chars
 * True for: false, null, undefined, 0, 0.0, "", " ".
 *
 * @param str
 * @returns {boolean}
 */
export function isBlank(str: any){
  return (!!!str || /^\s*$/.test(str));
}


export function isUUIDEmpty(str: any){
  return (!!!str || /^\s*$/.test(str) || str=="00000000-0000-0000-0000-000000000000");
}
