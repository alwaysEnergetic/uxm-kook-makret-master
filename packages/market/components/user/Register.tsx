import React, { useRef, useEffect } from 'react'
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
// import ReactSelect from "react-select";
import qs from 'query-string'
import { useApolloClient, ApolloError } from "@apollo/client";
import dotObject from "@khanakiajs/dot-object";
import {Loading} from "@kookjs-client/core/components/shared/Loading";
import ErrorLabel from "@kookjs-client/core/components/shared/ErrorLabel";
import { getGlobalVariable, KookErrorParser, getPlugin } from "@kookjs-client/core";
import Auth from "@kookjs-client/auth";
import { isBlank } from "@kookjs-client/util"

import { MUTATION_REGISTER_REST } from './query'
import CountrySelectRHF from "../shared/CountrySelectRHF"

export default function EditProfile(props) {
  const loadingEl = useRef<any>()
  const history = useHistory()
  // const [user, setUser] = useState({})
  // const [countries, setCountries] = useState([])
  // const [country, setCountry] = useState()
  // const [speakEnglish, setSpeakEnglish] = useState()
  const client = useApolloClient();
  const auth = getPlugin(Auth);

  /*
   * Parse values from parameters
   * [s: Sigupsource, pid: parentUid, email: Email, redirect: Redirect After Register]
  */
  const parsed = qs.parse(window.location.search);
  const referrer = document.referrer
  const parsedReferrer = qs.parseUrl(referrer)
  const parentUid = parsed['pid']
  const email = parsed.email ? parsed.email : null
  // const signUpSourceViaReferrer = Sapp.Util.objValue(parsedReferrer, ['query', 's'], null)
  const signUpSourceViaReferrer = dotObject.getArrayValue(parsedReferrer, ['query', 's'], null);
  // console.log('signUpSourceViaReferrer', signUpSourceViaReferrer)
  const signUpSource = parsed.s ? parsed.s : signUpSourceViaReferrer

  // Generate Random Password
  const pass = Math.floor((Math.random() * 10000000) + 1)

  const { register, handleSubmit, formState: { errors }, control, setValue, watch } = useForm({
    defaultValues: {
      firstName: null,
      lastName: null,
      password: pass,
      passwordConfirm: pass,
      signupSource: signUpSource,
      source2: parsed?.source2,
      parentUid: parentUid,
      email: email,
      countryId: null
    }
  })

  // const fetchCountries = async() => {
  //   const resultCountries = await client.query({
  //     query: QUERY_GEO_COUNTRIES,
  //   });
  //   const _countries = dotObject.getArrayValue(resultCountries, ["data", "geo_countries", "items"], []);
  //   let countries = []
  //   for (let value of _countries) {
  //     // console.log(value)
  //     countries.push({
  //       value: value.id,
  //       label: value.name
  //     })
  //   }

  //   setCountries(countries)
  // }

  const fetchInitialData = async () => {
    // loadingEl.current.show()
    // fetchCountries()
    // loadingEl.current.hide()
  }

  const onSubmit_ = async (data) => {
    // data.countryId = country
    // console.log(data)
    // return

    data.password = String(data.password)
    if(isBlank(data.parentUid)) {
      delete(data.parentUid)
    }

    loadingEl.current.show();
		client
			.mutate({
				mutation: MUTATION_REGISTER_REST,
				variables: {
					input: data,
				},
			})
			.then((res) => {
        console.log(res.data)
        
        const token = dotObject.getArrayValue(res, ["data", "register", "token"]);
        // console.log(token)
				if(!token) {
					return
				}

        auth.login(token)
        if(auth.isUserLoggedIn()) {
          auth.parseRedirectUrl(token, history)
        }

        // toastr.success("Successfully registered.");
        // const qparam = qs.parse(window.location.search);
        // history.push(qparam.redirect as any || '/')
				
			})
			.catch((err: ApolloError) => {
				const errorParser = new KookErrorParser(err);
				toastr.error(errorParser.message);

        if(errorParser.message=="Email already exists") {
          history.push("/login"+window.location.search)
        }
			})
			.finally(() => {
				loadingEl.current ? loadingEl.current.hide() : null;
			});
  }

  useEffect(() => {
    fetchInitialData()
  }, [])

  // const handleCountryChange = (selected) => {
  //   selected && setCountry(selected.value)
  // }

  // console.log(errors.passwordConfirm)

  return (
    <form onSubmit={handleSubmit(onSubmit_)} className="uform uform-vertical">
      <Loading ref={loadingEl} overlay />
      <div className="inner">
        <div className="text-center mb-4">
          <h3 className="font-weight-bold">Register</h3>
          {/* <ul style={{ display: 'inline-block', textAlign: 'left' }}>
            <li>Buy everything at discount</li>
            <li>Sell globally risk-free</li>
            <li>Prosper with rewards</li>
          </ul> */}
        </div>

        <input className="d-none" type="text" {...register('parentUid', {})} />
        <input className="d-none" type="text" {...register('signupSource', {})} />

        <div className="row mb-3">
          <label className="col-sm-4 col-form-label">First Name:</label>
          <div className="col-sm-8">
            <input
              type="text"
              {...register('firstName', { required: true })}
              className="form-control" />
            <ErrorLabel field={errors.firstName} />
          </div>
        </div>

        <div className="row mb-3">
          <label className="col-sm-4 col-form-label">Last Name:</label>
          <div className="col-sm-8">
            <input
              type="text"
              {...register('lastName')}
              className="form-control" />
            {/* <ErrorLabel field={errors.lastName} /> */}
          </div>
        </div>

        <div className="row mb-3">
          <label className="col-sm-4 col-form-label">Email:</label>
          <div className="col-sm-8">
            <input
              type="email"
              {...register('email', { required: true })}
              className="form-control" />
            <ErrorLabel field={errors.email} />
          </div>
        </div>

        <div className="row mb-3">
          <label className="col-sm-4 col-form-label">Password:</label>
          <div className="col-sm-8">
            <input
              type="text"
              {...register('password', { required: true })}
              className="form-control" />
            <ErrorLabel field={errors.password} />
          </div>
        </div>

        <div className="row mb-3">
          <label className="col-sm-4 col-form-label">Confirm Password:</label>
          <div className="col-sm-8">
            <input
              type="text"
              {...register('passwordConfirm', { 
                required: true ,
                validate: (value) => {
                  return value === watch('password'); // value is from password2 and watch will return value from password1
                }
              })}
              className="form-control" />
            <ErrorLabel field={errors.passwordConfirm} message="The passwords didn't match." />
          </div>
        </div>
{/* 
        <div className="row mb-3">
          <label className="col-sm-4 col-form-label">Country:</label>
          <div className="col-sm-8">
            <CountrySelectRHF name="countryId" control={control}
              />
          </div>
        </div> */}
        
        <div className="text-end">
          <input
            type="submit"
            className="btn btn-primary btn-block1 mt-2"
          />
        </div>
      </div>
    </form>
  );
}