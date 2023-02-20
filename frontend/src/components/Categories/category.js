import React, { useEffect, useMemo, useState } from 'react'
import DataTable from 'react-data-table-component';
import { callApi } from '../../utilites/callapi';
import { enumUtil } from '../../utilites/enum';
import Toaster from '../Shared/toaster';
import AddCategory from './addCategory';

export default function Category() {
  const API_End_Point = process.env.REACT_APP_URL;



  const [data, setData] = useState([]);
  const [pagModel, setPaginationModel] = useState({ totalCount: 0, perPage: 10, pageNum: 1 }) // paginatin model 
  const [popup, setPopup] = useState({ isOpen: false, id: null }) // add / edit popup
  const [isError, setIsError] = useState({ isOpen: false, message: "", type: '' }) // used to display notifier

  // get data 
  useEffect(() => {
    GetData(pagModel.perPage, pagModel.pageNum)
  }, [])
  const GetData = async (pageSize, pageNum) => {
    await callApi(API_End_Point + `/category/get?pageSize=${pageSize}&pageNum=${pageNum}`)
      .then((response) => {
        const { data } = response
        setData(data.categories)
        setPaginationModel({
          ...pagModel,
          totalCount: data.totalCount,
        })
      }).catch(err => {
        console.log(err);
      })
  }

  const handlePageChange = page => {

    if (!data.length) return;   // to prevent to run firsttime
    setPaginationModel({
      ...pagModel,
      pageNum: page
    })
    GetData(pagModel.perPage, page)
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    if (!data.length) return;  // to prevent to run firsttime
    setPaginationModel({
      ...pagModel,
      perPage: newPerPage
    })
    GetData(newPerPage, pagModel.pageNum)
  };

  // delete categ
  const handleDelete = async (row) => {
    try {
      const response = await callApi(API_End_Point + '/category/deletebyid/' + row._id, 'delete')
      setIsError({ isOpen: true, message: 'Deleted Succesfully', type: enumUtil.enumtoaster.success })
      GetData(10, 1)
    } catch (error) {
      setIsError({ isOpen: true, message: error, type: enumUtil.enumtoaster.error })

    }
  }
  const handlePopup = () => {
    setPopup({
      ...popup,
      isOpen: true
    })
  }
  // columns for data table
  const columns = useMemo(
    () => [
      {
        name: 'Id',
        selector: row => <span className='spanToHref' onClick={() => { setPopup({ isOpen: true, id: row._id }) }}>{row._id}</span>,
        sortable: true,
      },
      {
        name: 'Name',
        selector: row => row.name,
        sortable: true,
      },
      {
        name: 'Action',
        selector: row => <button type="button" className="btn-close" onClick={() => handleDelete(row)}></button>
      },
    ], []);
  return (
    <div>
      {popup.isOpen ? <AddCategory data={popup}
        onClose={() => {
          setPopup({
            isOpen: false,
            id: null
          })
          GetData(10, 1)
        }} /> : null}

      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        {isError.isOpen ?
          <Toaster
            message={isError.message}
            type={isError.type}
            onClose={() => {
              setIsError({
                isOpen: false, message: "", type: ""
              })
            }} /> : null}
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Categories</h1>
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#addCategory"
            onClick={handlePopup}
          >
            Add New
          </button>
        </div>

        <div className="table-responsive">
          <DataTable
            columns={columns}
            data={data}
            pagination
            paginationServer
            paginationTotalRows={pagModel.totalCount}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
          />
        </div>
      </main>

    </div>
  )
}
