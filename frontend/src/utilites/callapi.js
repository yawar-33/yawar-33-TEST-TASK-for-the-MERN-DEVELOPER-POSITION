import axios from 'axios'

const callApi = (endpoint, method, payload) => {
    const Token_Value = localStorage.getItem("token");
    const authHeaders = Token_Value
        ? {
            Authorization: `Bearer ${Token_Value}`,
        }
        : {}
    const configaxios = {
        method,
        // url: `${process.env.REACT_APP_URL}${endpoint}`,
        url: `${endpoint}`,
        data: payload,
        headers: {
            Accept: '*/*',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Access-Control-Max-Age': '6000',
            'Access-Control-Allow-Headers': '*',

            ...authHeaders,
        },
    }
    return new Promise((resolve, reject) => {
        axios(configaxios)
            .then((res) => {
                resolve(res)
            })
            .catch((error) => {
                reject(error)
            })
    })
}



export { callApi }
