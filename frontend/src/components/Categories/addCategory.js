import React, { useEffect, useState } from 'react'
import { callApi } from '../../utilites/callapi';
import { enumUtil } from '../../utilites/enum';
import isNull from '../../utilites/NullCheck';
import Toaster from '../Shared/toaster';

const AddCategory = (props) => {
    const { data, onClose } = { ...props }
    const API_End_Point = process.env.REACT_APP_URL;

    const [categoryData, setCategory] = useState({ name: "", id: "" })
    const [isError, setIsError] = useState({ isOpen: false, message: "", type: '' })
    const [nameVal, setNameVal] = useState("")
    useEffect(() => {
        if (!isNull(data.id)) {
            setCategory({ ...categoryData, id: data.id })
            callApi(API_End_Point + `/category/getbyid/` + data.id, 'get')
                .then((response) => {
                    const { data } = response
                    setCategory({
                        name: data.name, id: data._id
                    })

                }).catch(err => {
                    console.log(err);
                    setIsError({ isOpen: true, message: err.response.data.error, type: enumUtil.enumtoaster.error })
                })
        }

    }, [data.id])

    // on change to set category
    const handleChange = (e) => {
        setCategory({ ...categoryData, name: e.target.value })
    }
    const handleSave = async (e) => {
        e.preventDefault();

        // name validation 
        if (isNull(categoryData.name)) {
            setNameVal("Enter Name")
            return
        }

        // check if id is 0 then it will be save new categ case
        if (isNull(categoryData.id)) {
            await callApi(API_End_Point + `/category/save`, 'post', { name: categoryData.name })
                .then((response) => {
                    const { data } = response
                    setCategory({
                        name: data.name, id: data._id
                    })
                    setIsError({ isOpen: true, message: 'Added Successfully', type: enumUtil.enumtoaster.success })
                }).catch(err => {
                    console.log(err);
                    setIsError({ isOpen: true, message: err.response.data.error, type: enumUtil.enumtoaster.error })
                })
        } else {
              // update categ case
            let dataM = { name: categoryData.name }
            await callApi(API_End_Point + '/category/update/' + categoryData.id, 'patch', dataM)
                .then((response) => {
                    const { data } = response
                    setCategory({
                        name: data.name, id: data._id
                    })
                    setIsError({ isOpen: true, message: 'Updated Successfully', type: enumUtil.enumtoaster.success })

                }).catch(err => {
                    console.log(err);
                    setIsError({ isOpen: true, message: err.response.data.error, type: enumUtil.enumtoaster.error })
                })
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
                        type={isError.type}
                        onClose={() => {
                            setIsError({
                                isOpen: false, message: "", type: ""
                            })
                        }} /> : null}
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLiveLabel">Add/Update Category</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-floating m-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        placeholder="name"
                                        value={categoryData.name}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="email">Name</label>
                                    {isNull(nameVal) === false ?
                                        <div id="emailVal" className="invalid-feedback" style={{ display: 'block' }}>
                                            {nameVal}
                                        </div> : null}

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
export default AddCategory