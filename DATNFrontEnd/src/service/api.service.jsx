import axios from "./axios.custom";

const registerCustomerAPI = (
    username,
    password,
    confirm_password,
    phone,
    email,
    dateOfBirth
) => {
    const URL_BACKEND = "/api/v1/customer/register";
    const data = {
        username: username,
        password: password,
        confirm_password: confirm_password,
        phone: phone,
        email: email,
        dateOfBirth: dateOfBirth,
    };
    return axios.post(URL_BACKEND, data);
};

const loginCustomerAPI = (username, password) => {
    const URL_BACKEND = "/api/v1/auth/login";
    const data = {
        username: username,
        password: password,
    };
    return axios.post(URL_BACKEND, data);
};

const createProductAPI = (code, name, description, price, selectedSleeve, selectedCategory, selectedBrand, selectedCollar) => {
    const URL_BACKEND = "/api/v1/products";
    const data = {
        code: code,
        name: name,
        price: price,
        description: description,
        sleeve_id: selectedSleeve,
        category_id: selectedCategory,
        brand_id: selectedBrand,
        collar_id: selectedCollar,
    }

    return axios.post(URL_BACKEND, data)
}
const updateProductAPI = (id, code, name, description, price, selectValueSleeve, selectedValueBrand, selectedValueCategory, selectedValueCollar) => {
    const URL_BACKEND = `/api/v1/products/${id}`;
    const data = {
        id: id,
        code: code,
        name: name,
        price: price,
        description: description,
        sleeve_id: selectValueSleeve,
        category_id: selectedValueBrand,
        brand_id: selectedValueCategory,
        collar_id: selectedValueCollar,
    }
    return axios.put(URL_BACKEND, data)
}


const deleteProductAPI = (id) => {
    const URL_BACKEND = `/api/v1/products/${id}`;
    return axios.delete(URL_BACKEND)
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

//api of permission
const getAllPermission = () => {
    const URL_BACKEND = "/api/v1/permission/getAll"
    return axios.get(URL_BACKEND)
}

const createNewPermission = (name) => {
    const URL_BACKEND = "/api/v1/permission/";
    const data = {
        name: name
    }
    return axios.post(URL_BACKEND, data)
}

const deletePermissionById = (id) => {
    const URL_BACKEND = `/api/v1/permission/${id}`
    return axios.delete(URL_BACKEND)
}

const updatePermissionById = (id, name) => {
    const URL_BACKEND = `/api/v1/permission/${id}`
    return axios.put(URL_BACKEND, { name })
}



export {
    updatePermissionById,
    registerCustomerAPI,
    loginCustomerAPI,
    createProductAPI,
    fetchAllProduct,
    fetchDataSleeve,
    fetchDataCategory,
    fetchDataCollar,
    fetchDataBrand,
    updateProductAPI,
    deleteProductAPI,
    getAllPermission,
    createNewPermission,
    deletePermissionById
}
