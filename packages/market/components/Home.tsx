import React, { useEffect, useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { getGlobalVariable, getPlugin } from "@kookjs-client/core";
import Auth from '@kookjs-client/auth'


export default () => {
  const inputSearchEl = useRef<HTMLInputElement>()
  const history = useHistory()

  var globalVar = getGlobalVariable()
  const auth = getPlugin(Auth)
  
  const pushSearch = () => {
    const inputVal = inputSearchEl.current.value
    // const catVal = categorySelectEl.current.value
    
    /// This will never execute as page switches very fast so never triggers 
    // if(typeof globalVar.datalayer!== "undefined" && APP_CONFIG.env=="production") {
    //   const email = auth.getUserEmail()
    //   // globalVar.ga('send', 'event', 'Search', 'home_search', `${inputVal} - ${email}`);
    //   globalVar.dataLayer.push({
    //         'event':'uxm',
    //         'category': "Search",
    //         'action': "home_search", 
    //         // 'label': '', 
    //         'label': `${inputVal} - ${email}`
    //     });
    // }

    const inputValLower = inputVal ? inputVal.toLowerCase() : ''
    history.push(`/catalogue?s=${encodeURIComponent(inputValLower)}`)
  }

  const handleSearch = () => {
    pushSearch()
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
     pushSearch()
    }
  }

  return (
		<div className="HomeComp">
			{/* <div>SS:  {globalStore.searchText}</div> */}
			<h2 className="text-center">What are you looking for?</h2>
			<div className="searchBarWrapper">
				<div className="input-group mb-3">
					
						{/* <ItemCategoryDropdown ref={categorySelectEl} className="form-control custom-select" /> */}
						<a className="btn btn-primary d-none d-md-inline" href="/catalogue">
							What's New
						</a>
					
					<input
						type="text"
						ref={inputSearchEl}
						onKeyPress={handleKeyPress}
						className="form-control inputSearch"
						placeholder="Enter search words here"
					/>
					
						<button
							type="button"
							className="btn btn-primary btnSearch"
							onClick={handleSearch}
						>
							<i className="fas fa-search"></i>
							<span>Search</span>
						</button>
					
				</div>
				<div className="text-end">
					<a
						className="btn btn-outline-primary btn-sm me-2 d-inline d-md-none"
						href="/catalogue"
					>
						What's New
					</a>
				</div>
			</div>

			<div className="musicLaunchInfo">
				<div className="musicLaunchInfo__inner">
					<span className="yellow">NEW!</span> <a href="https://music.theuxm.com" className="siteurl">MUSIC.theUXM.COM</a> <span className="powered">powered by</span> The UXM Artists Fans Industry Network Engage Monetize
				</div>
			</div>
		</div>
	);
}