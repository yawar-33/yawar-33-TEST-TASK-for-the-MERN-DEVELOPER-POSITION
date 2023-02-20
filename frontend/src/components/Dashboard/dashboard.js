import React, { useEffect, useMemo, useState } from 'react'
import { callApi } from '../../utilites/callapi';

const Dashboard = () => {
  const API_End_Point = process.env.REACT_APP_URL;

  const [totalCars, setTotalCars] = useState(0);

  useEffect(() => {
    async function fetchCarsCount() {
      try {
        const response = await callApi(API_End_Point + `/car/getregistercars`);
        setTotalCars(response.data)
      } catch (error) {
        setTotalCars(0)
      }
    }
    fetchCarsCount();

  }, []);

  return (
    <div>


      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">

        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Total Cars Registered with system :{totalCars}</h1>

        </div>

      </main>
    </div>

  )
}
export default Dashboard