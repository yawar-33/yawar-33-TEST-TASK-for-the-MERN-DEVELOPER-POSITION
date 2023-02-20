import React, { useState } from 'react'
import axios from "axios";
import "./login.css"
import Signup from './signup'
import { useNavigate } from 'react-router-dom';
import isNull from '../../utilites/NullCheck';
import Toaster from '../Shared/toaster';
import { enumUtil } from '../../utilites/enum';
const Login = () => {
  const Navigate = useNavigate()
  const API_End_Point = process.env.REACT_APP_URL;
  const [isSignup, setIsSignup] = useState(false)
  const [loginModel, setLoginModel] = useState({
    email: "",
    password: ""
  })
  const [validationModel, setValidationModel] = useState({
    emailVal: "",
    passwordVal: "",
    isValidation: false
  })
  const [isError, setIsError] = useState({
    isOpen: false, message: "", type: ""
  })
  const handleChange = (e) => {
    let { id, value } = e.target;
    let model = { ...loginModel }
    model[id] = value;
    setLoginModel(model)
  }

  const handleLogin = (e) => {
    e.preventDefault();
    let myVal = { ...validationModel };
    myVal.isValidation = false;
    // check email validation 
    if (isNull(loginModel.email)) {
      myVal.emailVal = 'Enter Email';
      myVal.isValidation = true
    } else {
      myVal.emailVal = '';
      if (myVal.isValidation === false) myVal.isValidation = false
    }
    // password validations
    if (isNull(loginModel.password)) {
      myVal.passwordVal = 'Enter Password';
      myVal.isValidation = true
    } else {
      myVal.passwordVal = '';
      if (myVal.isValidation === false) myVal.isValidation = false
    }
    if (myVal.isValidation === true) {
      setValidationModel(myVal)
    } else {
      axios.post(API_End_Point + "/user/signin", loginModel)
        .then(response => {
          localStorage.setItem("token", response.data.token);
          Navigate("/dashboard")
        })
        .catch(error => {
          console.log(error);
          setIsError({
            isOpen: true, message: error.response.data.message, type: enumUtil.enumtoaster.error
          })
        });
    }

  }

  return (
    <>

      <main className="form-signin w-100 m-auto">
        {isError.isOpen ?
          <Toaster
            message={isError.message}
            onClose={() => {
              setIsError({
                isOpen: false, message: ""
              })
            }} /> : null}
        {isSignup ? <Signup /> :
          <form>
            <h1 className="h3 mb-3 fw-normal"> Please sign in</h1>

            <div className="form-floating m-2">
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="name@example.com"
                value={loginModel.email}
                onChange={handleChange}
              />
              <label htmlFor="email">Email address</label>
              <div id="emailVal" className="invalid-feedback" style={{ display: 'block' }}>
                {validationModel.emailVal}
              </div>
            </div>
            <div className="form-floating m-2">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                value={loginModel.password}
                onChange={handleChange}
              />
              <label htmlFor="password">Password</label>
              <div id="passwordVal" className="invalid-feedback" style={{ display: 'block' }}>
                {validationModel.passwordVal}
              </div>
            </div>

            <button className="w-100 btn btn-lg btn-primary" type="submit" onClick={handleLogin}>Sign in</button>
          </form>}


        <ul>
          {isSignup ?
            <li>
              <span> Already have an account? </span>
              <span className='spanToHref' onClick={() => setIsSignup(!isSignup)}> Sign in</span>
            </li> :
            <li>
              <span> Don’t have an account? </span>
              <span className='spanToHref' onClick={() => setIsSignup(!isSignup)}> Sign up</span>
            </li>}

        </ul>
      </main>
    </>

  )
}
export default Login
