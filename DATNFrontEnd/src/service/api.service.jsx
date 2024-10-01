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
    const URL_BACKEND = "/api/v1/auth/login";
    const data = {
        username: username,
        password: password
    }
    return axios.post(URL_BACKEND, data)
}


const createProductAPI = (code, name, description, price, sleeveName, categoryName, brandName, collarName) => {
    const URL_BACKEND = "/api/v1/products";
    const data = {
        code: code,
        name: name,
        price: price,
        description: description,
        sleeveName: sleeveName,
        categoryName: categoryName,
        brandName: brandName,
        collarName: collarName,
    }
    return axios.post(URL_BACKEND, data)
}
const updateProductAPI = (id, code, name, description, price, sleeveName, categoryName, brandName, collarName) => {
    const URL_BACKEND = "/api/v1/products";
    const data = {
        id: id,
        code: code,
        name: name,
        price: price,
        description: description,
        sleeveName: sleeveName,
        categoryName: categoryName,
        brandName: brandName,
        collarName: collarName,
    }
    return axios.put(URL_BACKEND, data)
}



const fetchAllProduct = () => {
    const URL_BACKEND = "/api/v1/products/getAll"
    return axios.get(URL_BACKEND)
}

const fetchDataSleeve = () => {
    const URL_BACKEND = "/api/v1/sleeves"
    return axios.get(URL_BACKEND)
}

const fetchDataCategory = () => {
    const URL_BACKEND = "api/v1/category"
    return axios.get(URL_BACKEND)
}

const fetchDataCollar = () => {
    const URL_BACKEND = "/api/v1/collar"
    return axios.get(URL_BACKEND)
}

const fetchDataBrand = () => {
    const URL_BACKEND = "api/v1/brand"
    return axios.get(URL_BACKEND)
}



export {
    registerCustomerAPI,
    loginCustomerAPI,
    createProductAPI,
    fetchAllProduct,
    fetchDataSleeve,
    fetchDataCategory,
    fetchDataCollar,
    fetchDataBrand,
    updateProductAPI
}