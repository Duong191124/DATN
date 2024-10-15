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

const createProductAPI = (
  code,
  name,
  description,
  price,
  selectedSleeve,
  selectedCategory,
  selectedBrand,
  selectedCollar
) => {
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
  };
  return axios.post(URL_BACKEND, data);
};
const updateProductAPI = (
  id,
  code,
  name,
  description,
  price,
  selectValueSleeve,
  selectedValueBrand,
  selectedValueCategory,
  selectedValueCollar
) => {
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
  };
  return axios.put(URL_BACKEND, data);
};

//API product
const deleteProductAPI = (id) => {
  const URL_BACKEND = `/api/v1/products/${id}`;
  return axios.delete(URL_BACKEND);
};

const fetchAllProduct = (page, pageSize) => {
  const URL_BACKEND = `/api/v1/products?page=${page}&pageSize=${pageSize}`;
  return axios.get(URL_BACKEND);
};

const fetchDataProductAPI = () => {
  const URL_BACKEND = "/api/v1/products/getAllProduct";
  return axios.get(URL_BACKEND);
};

const fetchDataSleeve = () => {
  const URL_BACKEND = "/api/v1/sleeves";
  return axios.get(URL_BACKEND);
};

const fetchDataCategory = () => {
  const URL_BACKEND = "api/v1/category";
  return axios.get(URL_BACKEND);
};

const fetchDataCollar = () => {
  const URL_BACKEND = "/api/v1/collar";
  return axios.get(URL_BACKEND);
};

const fetchDataBrand = () => {
<<<<<<< HEAD
    const URL_BACKEND = "api/v1/brand"
    return axios.get(URL_BACKEND)
}

const checkDuplicateProductAPI = async (type, value) => {
    return await axios.post(`/api/v1/products/check-duplicate`, { type, value });
}
=======
  const URL_BACKEND = "api/v1/brand";
  return axios.get(URL_BACKEND);
};
/* API Order*/
// const fetchDataOrders = () => {
//   const URL_BACKEND = "api/v1/orders/list";
//   return axios.get(URL_BACKEND);
// };
const fetchDataOrders = (
  staffName = "",
  startDate = null,
  endDate = null,
  orderStatus = "",
  orderCode = "",
  page = 0,
  limit = 10
) => {
  try {
    const URL_BACKEND = "/api/v1/orders/get-page";

    return axios.get(URL_BACKEND, {
      params: {
        staffName: staffName,
        startDate: startDate,
        endDate: endDate,
        orderStatus: orderStatus,
        orderCode: orderCode,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

const productFindById = (productId) => {
  const URL_BACKEND = `api/v1/products/productId/${productId}`;
  return axios.get(URL_BACKEND);
};
const colorFindById = (colorId) => {
  const URL_BACKEND = `api/v1/color/${colorId}`;
  return axios.get(URL_BACKEND);
};
const sizeFindById = (sizeId) => {
  const URL_BACKEND = `api/v1/size/${sizeId}`;
  return axios.get(URL_BACKEND);
};
const deleteOrder = (orderId) => {
  const URL_BACKEND = `api/v1/orders/delete?id=${orderId}`;
  return axios.delete(URL_BACKEND);
};
const updateStatusOrder = (orderId, status) => {
  const URL_BACKEND = `api/v1/orders/update-status/${orderId}`;
  const data = {
    status: status,
  };
  return axios.put(URL_BACKEND, data);
};
const orderStaffFindById = (staffId) => {
  const URL_BACKEND = `api/v1/staff/${staffId}`;
  return axios.get(URL_BACKEND);
};
const orderProductDetail = () => {
  const URL_BACKEND = "api/v1/productDetail";
  return axios.get(URL_BACKEND);
};
const orderStaff = () => {
  const URL_BACKEND = "api/v1/staff/getAll";
  return axios.get(URL_BACKEND);
};
const createOrder = async (
  code,
  orderDate,
  deliveryFee,
  totalAmount,
  moneyReceived,
  voucherId,
  staffId,
  orderDetailRequests
) => {
  const URL_BACKEND = "/api/v1/orders/add";
  const data = {
    code: code,
    orderDate: orderDate,
    deliveryFee: deliveryFee,
    totalAmount: totalAmount,
    moneyReceived: moneyReceived,
    voucherId: voucherId,
    staffId: staffId,
    orderDetailRequests: orderDetailRequests,
  };
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const response = await axios.post(URL_BACKEND, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Tạo đơn hàng thất bại:", error);
    throw new Error("Tạo đơn hàng thất bại: " + error.message);
  }
};
const createPayment = async (paymentDate, paymentMethod, orderId) => {
  const URL_BACKEND = "/api/v1/payments/add";
  const data = {
    paymentDate: paymentDate,
    paymentMethod: paymentMethod,
    orderId: orderId,
  };
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const response = await axios.post(URL_BACKEND, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Thanh toán thất bại:", error);
    throw new Error("Thanh toán thất bại: " + error.message);
  }
};
>>>>>>> 5a2884cd93aeab05ed8ca0cc21e068ede8cb0a9c
//API product-detail
const fetchDataProductDetail = () => {
  const URL_BACKEND = "/api/v1/productDetail/getAllProductDetail";
  return axios.get(URL_BACKEND);
};
const fetchDataColorAPI = () => {
  const URL_BACKEND = "/api/v1/color";
  return axios.get(URL_BACKEND);
};
const fetchDataSize = () => {
  const URL_BACKEND = "/api/v1/size";
  return axios.get(URL_BACKEND);
};

const createProductDetailAPi = (
  code,
  quantity,
  price,
  productId,
  sizeId,
  colorId
) => {
  const URL_BACKEND = "/api/v1/productDetail";
  const data = {
    code: code,
    quantity: quantity,
    price: price,
    productId: productId,
    sizeId: sizeId,
    colorId: colorId,
  };
  return axios.post(URL_BACKEND, data);
};

const updateProductDetailAPi = (
  id,
  code,
  quantity,
  price,
  selectedProduct,
  selectedSize,
  selectedColor
) => {
  const URL_BACKEND = `/api/v1/productDetail/${id}`;
  const data = {
    id: id,
    code: code,
    quantity: quantity,
    price: price,
    productId: selectedProduct,
    sizeId: selectedSize,
    colorId: selectedColor,
  };
  return axios.put(URL_BACKEND, data);
};

const deleteProductDetailAPI = (id) => {
  const URL_BACKEND = `/api/v1/productDetail/${id}`;
  return axios.delete(URL_BACKEND);
};
//API color
const fetchDataColor = () => {
  const URL_BACKEND = "/api/v1/color";
  return axios.get(URL_BACKEND);
};
const createColorAPI = (code, name, status) => {
<<<<<<< HEAD
    const URL_BACKEND = "/api/v1/color"
    const data = {
        code: code,
        name: name,
        status: status
    }
    return axios.post(URL_BACKEND, data)
}
// const checkCodeExistsAPI = (code, name, status) => {
//     const URL_BACKEND = "/api/v1/color"
//     const data = {
//         code: code,
//         name: name,
//         status: status
//     }
//     return axios.post(URL_BACKEND, data)
// }

=======
  const URL_BACKEND = "/api/v1/color";
  const data = {
    code: code,
    name: name,
    status: status,
  };
  return axios.post(URL_BACKEND, data);
};
const checkCodeExistsAPI = (code, name, status) => {
  const URL_BACKEND = "/api/v1/color";
  const data = {
    code: code,
    name: name,
    status: status,
  };
  return axios.post(URL_BACKEND, data);
};
>>>>>>> 5a2884cd93aeab05ed8ca0cc21e068ede8cb0a9c

const deleteColorAPI = (id) => {
  const URL_BACKEND = `/api/v1/color/${id}`;
  return axios.delete(URL_BACKEND);
};
const updateColorAPI = (id, code, name, status) => {
  const URL_BACKEND = `/api/v1/color/${id}`;
  const data = {
    id: id,
    code: code,
    name: name,
    status: status,
  };
  return axios.put(URL_BACKEND, data);
};
//API Size
const fetchDataSizeAPI = () => {
  const URL_BACKEND = "/api/v1/size";
  return axios.get(URL_BACKEND);
};
const createSizeAPI = (code, name, status) => {
  const URL_BACKEND = "/api/v1/size";
  const data = {
    code: code,
    name: name,
    status: status,
  };
  return axios.post(URL_BACKEND, data);
};
const updateSizeAPI = (id, code, name, status) => {
  const URL_BACKEND = `/api/v1/size/${id}`;
  const data = {
    id: id,
    code: code,
    name: name,
    status: status,
  };
  return axios.put(URL_BACKEND, data);
};

const deleteSizeAPI = (id) => {
  const URL_BACKEND = `/api/v1/size/${id}`;
  return axios.delete(URL_BACKEND);
};
//API collar
const fetchDataCollarAPI = () => {
  const URL_BACKEND = "/api/v1/collar";
  return axios.get(URL_BACKEND);
};
const createCollarAPI = (code, name, status) => {
  const URL_BACKEND = "/api/v1/collar";
  const data = {
    code: code,
    name: name,
    status: status,
  };
  return axios.post(URL_BACKEND, data);
};
const updateCollarAPI = (id, code, name, status) => {
  const URL_BACKEND = `/api/v1/collar/${id}`;
  const data = {
    id: id,
    code: code,
    name: name,
    status: status,
  };
  return axios.put(URL_BACKEND, data);
};
const deleteCollarAPI = (id) => {
  const URL_BACKEND = `/api/v1/collar/${id}`;
  return axios.delete(URL_BACKEND);
};
//API brand
const fetchDataBrandAPI = () => {
  const URL_BACKEND = "/api/v1/brand";
  return axios.get(URL_BACKEND);
};
const createBrandAPI = (code, name, status) => {
  const URL_BACKEND = "/api/v1/brand";
  const data = {
    code: code,
    name: name,
    status: status,
  };
  return axios.post(URL_BACKEND, data);
};
const updateBrandAPI = (id, code, name, status) => {
  const URL_BACKEND = `/api/v1/brand/${id}`;
  const data = {
    id: id,
    code: code,
    name: name,
    status: status,
  };
  return axios.put(URL_BACKEND, data);
};
const deleteBrandAPI = (id) => {
  const URL_BACKEND = `/api/v1/brand/${id}`;
  return axios.delete(URL_BACKEND);
};
//API category
const fetchDataCategoryAPI = () => {
  const URL_BACKEND = "/api/v1/category";
  return axios.get(URL_BACKEND);
};
const createCategoryAPI = (name) => {
  const URL_BACKEND = "/api/v1/category";
  const data = {
    name: name,
  };
  return axios.post(URL_BACKEND, data);
};
const updateCategoryAPI = (id, name) => {
  const URL_BACKEND = `/api/v1/category/${id}`;
  const data = {
    id: id,
    name: name,
  };
  return axios.put(URL_BACKEND, data);
};
const deleteCategoryAPI = (id) => {
  const URL_BACKEND = `/api/v1/category/${id}`;
  return axios.delete(URL_BACKEND);
};
//API sleeve
const fetchDataSleeveAPI = () => {
  const URL_BACKEND = "/api/v1/sleeves";
  return axios.get(URL_BACKEND);
};
const createSleeveAPI = (code, name) => {
  const URL_BACKEND = "/api/v1/sleeves";
  const data = {
    code: code,
    name: name,
  };
  return axios.post(URL_BACKEND, data);
};
const updateSleeveAPI = (id, code, name) => {
  const URL_BACKEND = `/api/v1/sleeves/${id}`;
  const data = {
    id: id,
    code,
    name: name,
  };
  return axios.put(URL_BACKEND, data);
};
const deleteSleeveAPI = (id) => {
  const URL_BACKEND = `/api/v1/sleeves/${id}`;
  return axios.delete(URL_BACKEND);
};
export const checkDuplicateSizeAPI = async (type, value) => {
  return await axios.post(`/api/v1/size/check-duplicate`, { type, value });
};
/*
    API permission
*/
<<<<<<< HEAD

const getAllPermission = () => {
    const URL_BACKEND = "/api/v1/permission/all";
    return axios.get(URL_BACKEND);
}

=======
const getAllPermission = () => {
  const URL_BACKEND = "/api/v1/permission/all";
  return axios.get(URL_BACKEND);
};
>>>>>>> 5a2884cd93aeab05ed8ca0cc21e068ede8cb0a9c
const getAllPermissionPagination = (page, size) => {
  const URL_BACKEND = `/api/v1/permission/getAll?page=${page}&size=${size}`;
  return axios.get(URL_BACKEND);
};
const createNewPermission = (name) => {
<<<<<<< HEAD
    const URL_BACKEND = "/api/v1/permission/";
    const data = {
        name: name
    }
    return axios.post(URL_BACKEND, data)
}

=======
  const URL_BACKEND = "/api/v1/permission/";
  const data = {
    name: name,
  };
  return axios.post(URL_BACKEND, data);
};
>>>>>>> 5a2884cd93aeab05ed8ca0cc21e068ede8cb0a9c
const deletePermissionById = (id) => {
  const URL_BACKEND = `/api/v1/permission/${id}`;
  return axios.delete(URL_BACKEND);
};
const updatePermissionById = (id, name) => {
  const URL_BACKEND = `/api/v1/permission/${id}`;
  return axios.put(URL_BACKEND, { name });
};
/*
    API staff
*/
<<<<<<< HEAD

const getAllStaff = (page, size) => {
    const URL_BACKEND = `/api/v1/staff/getAll?page=${page}&size=${size}`;
    return axios.get(URL_BACKEND);
}
=======
const getAllStaff = (page, size) => {
  const URL_BACKEND = `/api/v1/staff/getAll?page=${page}&size=${size}`;
  return axios.get(URL_BACKEND);
};
>>>>>>> 5a2884cd93aeab05ed8ca0cc21e068ede8cb0a9c
const getStaffPermissions = (id) => {
  const URL_BACKEND = `/api/v1/staff/${id}`;
  return axios.get(URL_BACKEND);
};
const updateStaffPermissions = (id, payload) => {
<<<<<<< HEAD
    const URL_BACKEND = `/api/v1/staff/update-permission/${id}`;
    return axios.put(URL_BACKEND, payload);
=======
  const URL_BACKEND = `/api/v1/staff/update-permission/${id}`;
  return axios.put(URL_BACKEND, payload);
>>>>>>> 5a2884cd93aeab05ed8ca0cc21e068ede8cb0a9c
};
const createNewStaff = (
  username,
  password,
  phoneNumber,
  email,
  address,
  name,
  gender,
  dateOfBirth
) => {
  const URL_BACKEND = "/api/v1/staff/register";
  const data = {
    username,
    password,
    phoneNumber,
    email,
    address,
    name,
    gender,
    dateOfBirth,
  };
  return axios.post(URL_BACKEND, data, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};
export {
<<<<<<< HEAD
    createNewStaff,
    getAllPermissionPagination,
    updatePermissionById,
    getAllPermission,
    getAllStaff,
    getStaffPermissions,
    updateStaffPermissions,
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
    createNewPermission,
    deletePermissionById,
    fetchDataProductAPI,
    fetchDataProductDetail,
    fetchDataColorAPI,
    fetchDataSize,
    createProductDetailAPi,
    updateProductDetailAPi,
    deleteProductDetailAPI,
    fetchDataColor,
    createColorAPI,
    deleteColorAPI,
    updateColorAPI,
    fetchDataSizeAPI,
    createSizeAPI,
    updateSizeAPI,
    deleteSizeAPI,
    fetchDataCollarAPI,
    createCollarAPI,
    updateCollarAPI,
    deleteCollarAPI,
    fetchDataBrandAPI,
    createBrandAPI,
    updateBrandAPI,
    deleteBrandAPI,
    fetchDataCategoryAPI,
    createCategoryAPI,
    updateCategoryAPI,
    deleteCategoryAPI,
    fetchDataSleeveAPI,
    createSleeveAPI,
    updateSleeveAPI,
    deleteSleeveAPI,
    checkDuplicateProductAPI
}
=======
  registerCustomerAPI,
  loginCustomerAPI,
  sizeFindById,
  colorFindById,
  deleteOrder,
  updateStatusOrder,
  orderStaffFindById,
  orderProductDetail,
  productFindById,
  fetchDataOrders,
  orderStaff,
  createOrder,
  createPayment,
  createNewStaff,
  getAllPermissionPagination,
  updatePermissionById,
  getAllPermission,
  getAllStaff,
  getStaffPermissions,
  updateStaffPermissions,
  createProductAPI,
  fetchAllProduct,
  fetchDataSleeve,
  fetchDataCategory,
  fetchDataCollar,
  fetchDataBrand,
  updateProductAPI,
  deleteProductAPI,
  createNewPermission,
  deletePermissionById,
  fetchDataProductAPI,
  fetchDataProductDetail,
  fetchDataColorAPI,
  fetchDataSize,
  createProductDetailAPi,
  updateProductDetailAPi,
  deleteProductDetailAPI,
  fetchDataColor,
  createColorAPI,
  deleteColorAPI,
  updateColorAPI,
  fetchDataSizeAPI,
  createSizeAPI,
  updateSizeAPI,
  deleteSizeAPI,
  fetchDataCollarAPI,
  createCollarAPI,
  updateCollarAPI,
  deleteCollarAPI,
  fetchDataBrandAPI,
  createBrandAPI,
  updateBrandAPI,
  deleteBrandAPI,
  fetchDataCategoryAPI,
  createCategoryAPI,
  updateCategoryAPI,
  deleteCategoryAPI,
  fetchDataSleeveAPI,
  createSleeveAPI,
  updateSleeveAPI,
  deleteSleeveAPI,
};
>>>>>>> 5a2884cd93aeab05ed8ca0cc21e068ede8cb0a9c
