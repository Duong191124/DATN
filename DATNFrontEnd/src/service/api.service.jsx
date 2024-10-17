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
const fetchCustomerList = () => {
    const URL_BACKEND = "/api/v1/customer/getAll"
    return axios.get(URL_BACKEND)
}
const loginCustomerAPI = (username, password) => {
    const URL_BACKEND = "/api/v1/auth/login";
    const data = {
        username: username,
        password: password
    }
    return axios.post(URL_BACKEND, data)
}


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

//API product
const deleteProductAPI = (id) => {
    const URL_BACKEND = `/api/v1/products/${id}`;
    return axios.delete(URL_BACKEND)
}


const fetchAllProduct = (page, pageSize) => {
    const URL_BACKEND = `/api/v1/products?page=${page}&pageSize=${pageSize}`
    return axios.get(URL_BACKEND)
}

const fetchDataProductAPI = () => {
    const URL_BACKEND = "/api/v1/products/getAllProduct"
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




//API product-detail

const fetchDataProductDetail = () => {
    const URL_BACKEND = "/api/v1/productDetail/getAllProductDetail"
    return axios.get(URL_BACKEND)
}

const fetchDataColorAPI = () => {
    const URL_BACKEND = "/api/v1/color"
    return axios.get(URL_BACKEND)
}

const fetchDataSize = () => {
    const URL_BACKEND = "/api/v1/size"
    return axios.get(URL_BACKEND)
}


const createProductDetailAPi = (code, quantity, price, productId, sizeId, colorId) => {
    const URL_BACKEND = "/api/v1/productDetail"
    const data = {
        code: code,
        quantity: quantity,
        price: price,
        productId: productId,
        sizeId: sizeId,
        colorId: colorId
    }
    return axios.post(URL_BACKEND, data)
}

const updateProductDetailAPi = (id, code, quantity, price, selectedProduct, selectedSize, selectedColor) => {
    const URL_BACKEND = `/api/v1/productDetail/${id}`
    const data = {
        id: id,
        code: code,
        quantity: quantity,
        price: price,
        productId: selectedProduct,
        sizeId: selectedSize,
        colorId: selectedColor
    }
    return axios.put(URL_BACKEND, data)
}


const deleteProductDetailAPI = (id) => {
    const URL_BACKEND = `/api/v1/productDetail/${id}`
    return axios.delete(URL_BACKEND)
}


//API color

const fetchDataColor = () => {
    const URL_BACKEND = "/api/v1/color"
    return axios.get(URL_BACKEND)
}
const createColorAPI = (code, name, status) => {
    const URL_BACKEND = "/api/v1/color"
    const data = {
        code: code,
        name: name,
        status: status
    }
    return axios.post(URL_BACKEND, data)
}

const deleteColorAPI = (id) => {
    const URL_BACKEND = `/api/v1/color/${id}`
    return axios.delete(URL_BACKEND)

}
const updateColorAPI = (id, code, name, status) => {
    const URL_BACKEND = `/api/v1/color/${id}`
    const data = {
        id: id,
        code: code,
        name: name,
        status: status
    }
    return axios.put(URL_BACKEND, data)
}


//API Size
const fetchDataSizeAPI = () => {
    const URL_BACKEND = "/api/v1/size"
    return axios.get(URL_BACKEND)
}
const createSizeAPI = (code, name, status) => {
    const URL_BACKEND = "/api/v1/size"
    const data = {
        code: code,
        name: name,
        status: status
    }
    return axios.post(URL_BACKEND, data)
}
const updateSizeAPI = (id, code, name, status) => {
    const URL_BACKEND = `/api/v1/size/${id}`
    const data = {
        id: id,
        code: code,
        name: name,
        status: status
    }
    return axios.put(URL_BACKEND, data)
}

const deleteSizeAPI = (id) => {
    const URL_BACKEND = `/api/v1/size/${id}`
    return axios.delete(URL_BACKEND)

}


//API collar
const fetchDataCollarAPI = () => {
    const URL_BACKEND = "/api/v1/collar"
    return axios.get(URL_BACKEND)
}

const createCollarAPI = (code, name, status) => {
    const URL_BACKEND = "/api/v1/collar"
    const data = {
        code: code,
        name: name,
        status: status
    }
    return axios.post(URL_BACKEND, data)
}

const updateCollarAPI = (id, code, name, status) => {
    const URL_BACKEND = `/api/v1/collar/${id}`
    const data = {
        id: id,
        code: code,
        name: name,
        status: status
    }
    return axios.put(URL_BACKEND, data)
}

const deleteCollarAPI = (id) => {
    const URL_BACKEND = `/api/v1/collar/${id}`
    return axios.delete(URL_BACKEND)
}


//API brand
const fetchDataBrandAPI = () => {
    const URL_BACKEND = "/api/v1/brand"
    return axios.get(URL_BACKEND)
}

const createBrandAPI = (code, name, status) => {
    const URL_BACKEND = "/api/v1/brand"
    const data = {
        code: code,
        name: name,
        status: status
    }
    return axios.post(URL_BACKEND, data)
}

const updateBrandAPI = (id, code, name, status) => {
    const URL_BACKEND = `/api/v1/brand/${id}`
    const data = {
        id: id,
        code: code,
        name: name,
        status: status
    }
    return axios.put(URL_BACKEND, data)
}

const deleteBrandAPI = (id) => {
    const URL_BACKEND = `/api/v1/brand/${id}`
    return axios.delete(URL_BACKEND)
}


//API category
const fetchDataCategoryAPI = () => {
    const URL_BACKEND = "/api/v1/category"
    return axios.get(URL_BACKEND)
}

const createCategoryAPI = (name) => {
    const URL_BACKEND = "/api/v1/category"
    const data = {
        name: name,
    }
    return axios.post(URL_BACKEND, data)
}

const updateCategoryAPI = (id, name) => {
    const URL_BACKEND = `/api/v1/category/${id}`
    const data = {
        id: id,
        name: name
    }
    return axios.put(URL_BACKEND, data)
}

const deleteCategoryAPI = (id) => {
    const URL_BACKEND = `/api/v1/sleeves/${id}`
    return axios.delete(URL_BACKEND)
}

//API sleeve
const fetchDataSleeveAPI = () => {
    const URL_BACKEND = "/api/v1/sleeves"
    return axios.get(URL_BACKEND)
}

const createSleeveAPI = (name) => {
    const URL_BACKEND = "/api/v1/sleeves"
    const data = {
        name: name,
    }
    return axios.post(URL_BACKEND, data)
}

const updateSleeveAPI = (id, name) => {
    const URL_BACKEND = `/api/v1/sleeves/${id}`
    const data = {
        id: id,
        name: name
    }
    return axios.put(URL_BACKEND, data)
}

const deleteSleeveAPI = (id) => {
    const URL_BACKEND = `/api/v1/sleeves/${id}`
    return axios.delete(URL_BACKEND)
}

//API Promotion

const fetchDataPromotion = () => {
    const URL_BACKEND = "/api/v1/promotion"
    return axios.get(URL_BACKEND)
}

const createPromotion = async (name, description, startDate, endDate, discountPercent, discountAmount, status, productDetailsId) => {
    const URL_BACKEND = "/api/v1/promotion";
    const data = {
        name,
        description,
        startDate,
        endDate,
        discountPercent,
        discountAmount,
        status,
        productDetailsId // Chỉnh sửa tại đây để sử dụng productDetailsId
    };

    try {
        const response = await axios.post(URL_BACKEND, data);
        return response; // Trả về phản hồi nếu thành công
    } catch (error) {
        return { data: null, message: error.response ? error.response.data : error.message }; // Trả về thông tin lỗi
    }
};
// Hàm cập nhật khuyến mãi
const updatePromotion = (id, { name, description, startDate, endDate, discountPercent, discountAmount, status, productDetailsId }) => {
    const URL_BACKEND = `/api/v1/promotion/${id}`; // Đường dẫn đến API cập nhật khuyến mãi
    const data = {
        name,
        description,
        startDate,
        endDate,
        discountPercent,
        discountAmount,
        status,
        productDetailsId
    };

    return axios.put(URL_BACKEND, data); // Gọi PUT với URL và dữ liệu
};

const detailPromotion = (id) => {
    const URL_BACKEND = `/api/v1/promotion/detail/${id}`
    return axios.get(URL_BACKEND)
}



const deletePromotionAPI = (id) => {
    const URL_BACKEND = `/api/v1/promotion/${id}`
    return axios.delete(URL_BACKEND)
}

// API VOUCHER
const fetchDataVoucher = () => {
    const URL_BACKEND = "/api/v1/voucher"
    return axios.get(URL_BACKEND)
};
const createVoucher = async (
    code,
    quantity,
    discountAmount,
    discountPercent,
    expirationDate,
    minPurchaseAmount,
    maxDiscountAmount,
    termsAndConditions,
    // status,
    customers
) =>{
    const URL_BACKEND = "/api/v1/voucher";
    const data = {
        code:code,
        quantity:quantity,
        discountAmount:discountAmount,
        discountPercent:discountPercent,
        expirationDate:expirationDate,
        minPurchaseAmount:minPurchaseAmount,
        maxDiscountAmount:maxDiscountAmount,
        termsAndConditions:termsAndConditions,
        // status,
        customers:customers
    };
   return axios.post(URL_BACKEND, data);
}


const deleteVoucher = async (id) => {
    const URL_BACKEND = `/api/v1/voucher/${id}`;
    return axios.delete(URL_BACKEND);
};
const fetchVoucherById = (id) => {
    const URL_BACKEND = `/api/v1/voucher/detail/${id}`;
    return axios.get(URL_BACKEND);
};
const updateVoucher = async (id, { code, quantity, discountAmount, discountPercent, expirationDate, minPurchaseAmount, maxDiscountAmount, termsAndConditions,customers }) => {
    const URL_BACKEND = `/api/v1/voucher/${id}`;
    const data = {
        code,
        quantity,
        discountAmount,
        discountPercent,
        expirationDate,
        minPurchaseAmount,
        maxDiscountAmount,
        termsAndConditions,
        status: 1,// Gán giá trị trạng thái mặc định là 1 (active)
        customers 
    };
    return axios.put(URL_BACKEND, data);
};

export {
    registerCustomerAPI,
    loginCustomerAPI,
    fetchCustomerList,

    //API product
    createProductAPI,
    fetchAllProduct,
    fetchDataSleeve,
    fetchDataCategory,
    fetchDataCollar,
    fetchDataBrand,
    updateProductAPI,
    deleteProductAPI,
    fetchDataProductAPI,

    //API product-detail
    fetchDataProductDetail,
    fetchDataColorAPI,
    fetchDataSize,
    createProductDetailAPi,
    updateProductDetailAPi,
    deleteProductDetailAPI,


    //API color
    fetchDataColor,
    createColorAPI,
    deleteColorAPI,
    updateColorAPI,

    //API size
    fetchDataSizeAPI,
    createSizeAPI,
    updateSizeAPI,
    deleteSizeAPI,

    //API collar
    fetchDataCollarAPI,
    createCollarAPI,
    updateCollarAPI,
    deleteCollarAPI,

    //API Brand
    fetchDataBrandAPI,
    createBrandAPI,
    updateBrandAPI,
    deleteBrandAPI,

    //API category
    fetchDataCategoryAPI,
    createCategoryAPI,
    updateCategoryAPI,
    deleteCategoryAPI,

    //API Sleeve
    fetchDataSleeveAPI,
    createSleeveAPI,
    updateSleeveAPI,
    deleteSleeveAPI,

    //API Promotion
    fetchDataPromotion,
    createPromotion,
    deletePromotionAPI,
    updatePromotion,
    detailPromotion,

    // API VOUCHER
    fetchDataVoucher,
    deleteVoucher,
    createVoucher,
    fetchVoucherById,
    updateVoucher
}