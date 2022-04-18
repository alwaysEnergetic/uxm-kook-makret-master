import React, { useRef, useEffect, useState } from 'react'
import { useForm, Controller } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import qs from 'query-string';
import { useApolloClient, ApolloError } from "@apollo/client";
import { getGlobalVariable, KookErrorParser, getPlugin } from "@kookjs-client/core";
import dotObject from "@khanakiajs/dot-object";
import ErrorLabel from "@kookjs-client/core/components/shared/ErrorLabel";
import {Loading} from "@kookjs-client/core/components/shared/Loading";
import { MUTATION_CHECK_EMAIL_EXISTS } from './query'

export default function EditProfile(props) {
  const loadingEl = useRef<any>()
  const history = useHistory()
  const client = useApolloClient();
  const { register, handleSubmit, formState: { errors }, control, setValue } = useForm()

  const onSubmit_ = data => {
    console.log(data)

    loadingEl.current.show();
		client
			.mutate({
				mutation: MUTATION_CHECK_EMAIL_EXISTS,
				variables: {
					input: data,
				},
			})
			.then((res) => {
        console.log(res.data)
        
        const isExists = dotObject.getArrayValue(res, ["data", "checkEmailExists", "isExists"], false);
        
        let urlPath = "/register"
				if(isExists) {
					urlPath = "/login"
				}
        let qsparseurl = qs.parseUrl(window.location.href)
        
        let pushUrl = qs.stringifyUrl({
          url: urlPath,
          query: qsparseurl.query
        })

        // console.log(pushUrl)
        history.push(pushUrl)
				
			})
			.catch((err: ApolloError) => {
				const errorParser = new KookErrorParser(err);
				toastr.error(errorParser.message);
			})
			.finally(() => {
				loadingEl.current ? loadingEl.current.hide() : null;
			});
  }

  useEffect(() => {
   
		const qsparse = qs.parse(window.location.search);
    
		if (qsparse.email) {
			setValue("email", qsparse.email as any);
		}
	}, []);


  return (
    <form onSubmit={handleSubmit(onSubmit_)} className="uform uform-vertical">
      <Loading ref={loadingEl} overlay />
      <div className="inner">
        <div className="text-center mb-4">
          <h2 className="font-weight-bold">Join free so you can</h2>
          {/* <h5>Simply complete the FREE membership signup below and you’re eligible to access and receive all UXM benefits forever!</h5> */}
          <ul style={{ display: 'inline-block', textAlign: 'left' }}>
            <li>Buy everything at discount</li>
            <li>Sell globally risk-free</li>
            <li>Prosper with rewards</li>
          </ul>
        </div>
        <div className="mb-3">
          <label className="col-form-label">Email Address:</label>
          <input
            type="email"
            {...register('email', { required: true, pattern: /^\S+@\S+$/i  })}
            className="form-control" />
          <ErrorLabel field={errors.email} />
        </div>
        <input
          type="submit"
          className="btn btn-primary btn-block mt-2"
          value='Join Free'
        />
      </div>
    </form>
  );
}