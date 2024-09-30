import axios from './axios.custom'

const registerCustomerAPI = (username, password, confirm_password, phone, email, dateOfBirth) => {
    const URL_BACKEND = "/api/v1/customer/register";
    const data = {
        username: username,
        password: password,
        confirm_password: confirm_password,
        phone: phone,
        email: email,
        dateOfBirth: dateOfBirth
    }
    return axios.post(URL_BACKEND, data);
}

const loginCustomerAPI = (username, password) => {
    const URL_BACKEND = "/user/login";
    const data = {
        username: username,
        password: password
    }
    return axios.post(URL_BACKEND, data)
}

const getAllPermission = () =>{
    const URL_BACKEND = "permittion/all";
    return axios.get(URL_BACKEND);
}

export {registerCustomerAPI, loginCustomerAPI, getAllPermission}