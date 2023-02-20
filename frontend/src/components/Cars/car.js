import React, { useEffect, useMemo, useState } from 'react'
import DataTable from 'react-data-table-component';
import { callApi } from '../../utilites/callapi';
import { enumUtil } from '../../utilites/enum';
import Toaster from '../Shared/toaster';
import AddCar from './addCar';

const Car = () => {
  const API_End_Point = process.env.REACT_APP_URL;

  const [data, setData] = useState([]);
  const [pagModel, setPaginationModel] = useState({ totalCount: 0, perPage: 10, pageNum: 1 }) // pagination controll
  const [popup, setPopup] = useState({ isOpen: false, id: null }) // add / update on same screen popup 
  const [isError, setIsError] = useState({ isOpen: false, message: "", type: '' }) // display notifier

  // get data 
  useEffect(() => {
    GetData(pagModel.perPage, pagModel.pageNum)
  }, [])
  const GetData = async (pageSize, pageNum) => {
    await callApi(API_End_Point + `/car/get?pageSize=${pageSize}&pageNum=${pageNum}`)
      .then((response) => {
        const { data } = response
        setData(data.cars)
        setPaginationModel({
          ...pagModel,
          totalCount: data.totalCount,
        })
      }).catch(err => {
        console.log(err);
      })
  }

  const handlePageChange = page => {
    if (!data.length) return; // first time prevent to run
    setPaginationModel({
      ...pagModel,
      pageNum: page
    })
    GetData(pagModel.perPage, page)
  };

  const handlePerRowsChange = (newPerPage, page) => {
    if (!data.length) return; // first time prevent to run
    setPaginationModel({
      ...pagModel,
      perPage: newPerPage
    })
    GetData(newPerPage, pagModel.pageNum)
  };
  const handleDelete = async (row) => {
    try {
      const response = await callApi(API_End_Point + '/car/deletebyid/' + row._id, 'delete')
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
        name: 'Make',
        selector: row => row.make,
        sortable: true,
      },
      {
        name: 'Model',
        selector: row => row.model,
        sortable: true,
      },
      {
        name: 'Color',
        selector: row => row.color,
        sortable: true,
      },
      {
        name: 'Reg #',
        selector: row => row.registrationNo,
        sortable: true,
      },
      {
        name: 'Category',
        selector: row => row?.category?.name,
        sortable: true,
      },
      {
        name: 'Action',
        selector: row => <button type="button" className="btn-close" onClick={() => handleDelete(row)}></button>
      },
    ],
    []
  );
  return (
    <div>

      {popup.isOpen ? <AddCar data={popup}
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
          <h1 className="h2">Cars</h1>
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
export default Car