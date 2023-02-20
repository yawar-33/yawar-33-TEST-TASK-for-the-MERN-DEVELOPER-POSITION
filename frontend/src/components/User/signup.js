import axios from 'axios'
import React, { useState } from 'react'
import { enumUtil } from '../../utilites/enum';
import isNull from '../../utilites/NullCheck';
import Toaster from '../Shared/toaster';
import "./login.css"
const Signup = () => {
    const API_End_Point = process.env.REACT_APP_URL;

    const [signupModel, setSignupModel] = useState({
        userName: "",
        email: ""
    })
    const [validationModel, setValidationModel] = useState({
        emailVal: "",
        userNameVal: "",
        isValidation: false
    })
    const [isError, setIsError] = useState({
        isOpen: false, message: "", type: ""
    })
    const handleChange = (e) => {
        let { id, value } = e.target;
        let model = { ...signupModel }
        model[id] = value;
        setSignupModel(model)
    }

    const handleSignup = (e) => {
        e.preventDefault();
        let myVal = { ...validationModel };
        myVal.isValidation = false;
        // check email validation 
        if (isNull(signupModel.email)) {
            myVal.emailVal = 'Enter Email';
            myVal.isValidation = true
        } else {
            myVal.emailVal = '';
            if (myVal.isValidation === false) myVal.isValidation = false
        }
        // userName validations
        if (isNull(signupModel.userName)) {
            myVal.userNameVal = 'Enter username';
            myVal.isValidation = true
        } else {
            myVal.userNameVal = '';
            if (myVal.isValidation === false) myVal.isValidation = false
        }
        if (myVal.isValidation === true) {
            setValidationModel(myVal)
        } else {
            axios.post(API_End_Point + "/user/signup", signupModel)
                .then(response => {
                    setIsError({
                        isOpen: true, message: response.data.message, type: enumUtil.enumtoaster.success
                    })
                })
                .catch(error => {
                    setIsError({
                        isOpen: true, message: error, type: enumUtil.enumtoaster.error
                    })
                });
        }

    }
    return (
        <>
            {isError.isOpen ?
                <Toaster
                    message={isError.message}
                    onClose={() => {
                        setIsError({
                            isOpen: false, message: ""
                        })
                    }} /> : null}
            <form>
                <h1 className="h3 mb-3 fw-normal">Please sign up</h1>
                <div className="form-floating  m-2">
                    <input
                        type="text"
                        className="form-control"
                        id="userName"
                        placeholder="User name"
                        value={signupModel.userName}
                        onChange={handleChange}
                    />
                    <label htmlFor="userName">User name</label>
                    <div id="userNameVal" className="invalid-feedback" style={{ display: 'block' }}>
                        {validationModel.userNameVal}
                    </div>
                </div>
                <div className="form-floating m-2">
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="name@example.com"
                        value={signupModel.email}
                        onChange={handleChange}
                    />
                    <label htmlFor="email">Email address</label>
                    <div id="emailVal" className="invalid-feedback" style={{ display: 'block' }}>
                        {validationModel.emailVal}
                    </div>
                </div>
                <button className="w-100 btn btn-lg btn-primary" type="submit" onClick={handleSignup}>Sign up</button>
            </form>
        </>

    )
}
export default Signup
