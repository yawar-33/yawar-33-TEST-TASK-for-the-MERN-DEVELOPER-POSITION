import React, { useEffect, useState } from 'react'
import { callApi } from '../../utilites/callapi';
import { enumUtil } from '../../utilites/enum';
import isNull from '../../utilites/NullCheck';
import Toaster from '../Shared/toaster';

const AddCar = (props) => {
    const { data, onClose } = { ...props }
    const API_End_Point = process.env.REACT_APP_URL;

    const [carData, setCar] = useState({
        id: "",
        category: "",
        make: "",
        model: "",
        color: "",
        registrationNo: ""
    })
    const [val, setVal] = useState({
        categoryVal: "",
        makeVal: "",
        modelVal: "",
        colorVal: "",
        registrationNoVal: "",
        validation: false
    })
    const [isError, setIsError] = useState({ isOpen: false, message: "", type: "" })
    const [categories, setCategories] = useState([])
    useEffect(() => {
        // fetch all categ to display in dropdown --- without pagination
        async function fetchCategories() {
            try {
                const response = await callApi(API_End_Point + `/category/getall`);
                setCategories(response.data)
            } catch (error) {
                setCategories([])
            }
        }
        fetchCategories();
        if (!isNull(data.id)) { // if id is not null then get data by id 
            setCar({ ...carData, id: data.id })
            callApi(API_End_Point + `/car/getbyid/` + data.id, 'get')
                .then((response) => {
                    const { data } = response
                    setCar({
                        id: data._id,
                        category: data.category._id,
                        make: data.make,
                        model: data.model,
                        color: data.color,
                        registrationNo: data.registrationNo,
                    })
                }).catch(err => {
                    console.log(err);
                    setIsError({ isOpen: true, message: err.response.data.error, type: enumUtil.enumtoaster.error })
                })
        }
    }, [data.id]);

    const handleChange = (e) => {
        setCar({ ...carData, [e.target.id]: e.target.value })
    }
    const handleSave = async (e) => {
        e.preventDefault();
        // check validation .. req fields 
        if (handleCarValidation()) {
            return
        }
        // if id is null or 0 then save new data case else update 
        if (isNull(carData.id)) {
            await callApi(API_End_Point + `/car/save`, 'post', carData)
                .then((response) => {
                    const { data } = response
                    setCar({
                        id: data._id,
                        category: data.category,
                        make: data.make,
                        model: data.model,
                        color: data.color,
                        registrationNo: data.registrationNo,
                    })
                    setIsError({ isOpen: true, message: 'Added Succesfully', type: enumUtil.enumtoaster.success })
                }).catch(err => {
                    console.log(err);
                    setIsError({ isOpen: true, message: err.response.data.error,type: enumUtil.enumtoaster.error })
                })
        } else {
            await callApi(API_End_Point + '/car/update/' + carData.id, 'patch', carData)
                .then((response) => {
                    const { data } = response
                    setCar({
                        id: data._id,
                        category: data.category,
                        make: data.make,
                        model: data.model,
                        color: data.color,
                        registrationNo: data.registrationNo,
                    })
                    setIsError({ isOpen: true, message: 'Updated Succesfully', type: enumUtil.enumtoaster.success })

                }).catch(err => {
                    console.log(err);
                    setIsError({ isOpen: true, message: err.response.data.error,type: enumUtil.enumtoaster.error })
                })
        }
    }

    const handleCarValidation = () => {
        let myVal = { ...val }
        myVal.validation = false
        if (isNull(carData.category)) {
            myVal.categoryVal = 'Select Category'
            myVal.validation = true
        } else {
            myVal.categoryVal = ''
            if (myVal.validation === false) myVal.validation = false
        }
        if (isNull(carData.make)) {
            myVal.makeVal = 'Make is required'
            myVal.validation = true
        } else {
            myVal.makeVal = ''
            if (myVal.validation === false) myVal.validation = false
        }
        if (isNull(carData.model)) {
            myVal.modelVal = 'Enter Model'
            myVal.validation = true
        } else {
            myVal.modelVal = ''
            if (myVal.validation === false) myVal.validation = false
        }
        if (isNull(carData.color)) {
            myVal.colorVal = 'Enter Color';
            myVal.validation = true
        } else {
            myVal.colorVal = ''
            if (myVal.validation === false) myVal.validation = false
        }
        if (isNull(carData.registrationNo)) {
            myVal.registrationNoVal = 'Enter Reg Num';
            myVal.validation = true
        } else {
            myVal.registrationNoVal = ''
            if (myVal.validation === false) myVal.validation = false
        }

        if (myVal.validation === true) {
            setVal(myVal)
            return true
        } else {
            setVal(myVal)
            return false
        }
    }

    return (
        <>
            <div className="modal fade show"
                id="addCategory"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex={"-1"}
                aria-labelledby="addCategory"
                aria-hidden="true"
                style={{
                    display: data.isOpen ? "block" : "none",
                    paddingRight: '2px',
                    backgroundColor: 'rgba(77, 77, 77, 0.6)',
                    overflowY: 'hidden',
                    zIndex: 1040
                }}
            >
                {isError.isOpen ?
                    <Toaster
                        message={isError.message}
                        onClose={() => {
                            setIsError({
                                isOpen: false, message: "", type: ""
                            })
                        }} /> : null}
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLiveLabel">Add/Update Car</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className='row'>
                                    <div className='col'>
                                        <label htmlFor="make">Make</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="make"
                                            placeholder="make"
                                            value={carData.make}
                                            onChange={handleChange}
                                        />
                                        <div id="makeVal" className="invalid-feedback" style={{ display: 'block' }}>
                                            {val.makeVal}
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <label htmlFor="model">Model</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="model"
                                            placeholder="model"
                                            value={carData.model}
                                            onChange={handleChange}
                                        />
                                        <div id="modelVal" className="invalid-feedback" style={{ display: 'block' }}>
                                            {val.modelVal}
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <label htmlFor="color">Color</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="color"
                                            placeholder="color"
                                            value={carData.color}
                                            onChange={handleChange}
                                        />
                                        <div id="colorVal" className="invalid-feedback" style={{ display: 'block' }}>
                                            {val.colorVal}
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <label htmlFor="registrationNo">Model</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="registrationNo"
                                            placeholder="Reg No"
                                            value={carData.registrationNo}
                                            onChange={handleChange}
                                        />
                                        <div id="registrationNoVal" className="invalid-feedback" style={{ display: 'block' }}>
                                            {val.registrationNoVal}
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <label htmlFor="category" className="form-label">Select menu</label>
                                        <select className="form-select" id="category" value={carData.category} onChange={handleChange}>
                                            <option selected>Select Category</option>
                                            {categories.map((categ) => {
                                                return (
                                                    <option value={categ._id} key={categ._id}>{categ.name}</option>
                                                )
                                            })}
                                        </select>
                                        <div id="categoryVal" className="invalid-feedback" style={{ display: 'block' }}>
                                            {val.categoryVal}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onClose}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleSave}>{isNull(data.id) ? 'Save' : 'Update'}</button>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default AddCar