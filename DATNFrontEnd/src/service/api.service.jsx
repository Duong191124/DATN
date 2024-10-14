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

const deleteProductAPI = (id) => {
  const URL_BACKEND = `/api/v1/products/${id}`;
  return axios.delete(URL_BACKEND);
};

const fetchAllProduct = () => {
  const URL_BACKEND = "/api/v1/products/getAll";
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
  const URL_BACKEND = "api/v1/brand";
  return axios.get(URL_BACKEND);
};
/* order component*/
const fetchDataOrders = () => {
  const URL_BACKEND = "api/v1/orders/list";
  return axios.get(URL_BACKEND);
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

export {
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
  fetchDataOrders,
  productFindById,
  sizeFindById,
  colorFindById,
  deleteOrder,
  updateStatusOrder,
  orderStaffFindById,
  orderProductDetail,
  orderStaff,
  createOrder,
  createPayment,
};
