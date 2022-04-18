import React, { useState, MutableRefObject, useEffect } from "react";

type ItemSearchInput = {
  defaultValue?: string
  inputRef?: MutableRefObject<HTMLInputElement>
  onChange?: (value) => void
}

export default (props: ItemSearchInput) => {
	const { defaultValue='ddd', onChange, inputRef } = props
  const [value, setValue] = useState(defaultValue);

  // console.log("defaultValue", defaultValue)
  // console.log("value", value)
	
	const handleSearchInputKeyPress = (e) => {
		if (e.key === "Enter") {
			handleSearch()
		}
	};

	const handleSearch = () => {
    if (typeof onChange == 'function') {
      onChange(value)
    }
	}

  useEffect(() => {
    if(!defaultValue) return
    setValue(defaultValue)
  }, [defaultValue])

	return (
		<div className="input-group mb-3 item-search-input">
      <input
        type="text"
        ref={inputRef}
        // defaultValue={value}
        value={value ? value : ''}
        onKeyPress={handleSearchInputKeyPress}
        onChange={(e) => setValue(e.target.value)}
        className="form-control"
        placeholder="Enter search words here"
      />
      <button className="btn btn-outline-primary" type="button" onClick={() => handleSearch()}>
        Search
      </button>
    </div>
	);
}