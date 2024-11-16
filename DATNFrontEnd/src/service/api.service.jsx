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
const fetchCustomerList = () => {
  const URL_BACKEND = `/api/v1/customer/getAll`;
  return axios.get(URL_BACKEND);
};
const loginCustomerAPI = (username, password) => {
  const URL_BACKEND = "/api/v1/auth/login";
  const data = {
    username: username,
    password: password,
  };
  return axios.post(URL_BACKEND, data);
};
const getUserInfo = () => {
  try {
    const URL_BACKEND = "/api/v1/auth/getInformation";
    const token = localStorage.getItem("access_token");
    return axios.get(URL_BACKEND, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Có lỗi xảy ra:", error);
  }
};
/*
  API product
*/
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
  sleeve_id,
  category_id,
  brand_id,
  collar_id,
  status
) => {
  const URL_BACKEND = `/api/v1/products/${id}`;
  const data = {
    id: id,
    code: code,
    name: name,
    price: price,
    description: description,
    sleeve_id: sleeve_id,
    category_id: category_id,
    brand_id: brand_id,
    collar_id: collar_id,
    status: status,
  };
  return axios.put(URL_BACKEND, data);
};
const uploadImageAPI = (id, formData) => {
  return axios.post(`/api/v1/products/upload/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
const deleteProductAPI = (id) => {
  const URL_BACKEND = `/api/v1/products/${id}`;
  return axios.delete(URL_BACKEND);
};
const fetchAllProduct = (page, pageSize) => {
  const URL_BACKEND = `/api/v1/products?page=${page}&pageSize=${pageSize}`;
  return axios.get(URL_BACKEND);
};
const fetchDataProduct = () => {
  const URL_BACKEND = `/api/v1/products/getAllProduct`;
  return axios.get(URL_BACKEND);
}

const fetchDataPageAndFilterProduct = async (
  category_id,
  name,
  sleeve_id,
  collar_id,
  brand_id,
  status, // Thêm status
  page = 1,
  pageSize = 3
) => {
  const URL_BACKEND = "/api/v1/products";
  const params = {
    category_id: category_id,
    name: name,
    sleeve_id: sleeve_id,
    collar_id: collar_id,
    brand_id: brand_id,
    status: status, // Thêm status vào params
    page: page,
    pageSize: pageSize,
  };
  return axios.get(URL_BACKEND, { params });
};

const fetchDataProductAPI = () => {
  const URL_BACKEND = "/api/v1/products/getAllProduct";
  return axios.get(URL_BACKEND);
};


const fetchDataProductById = (id) => {
  const URL_BACKEND = `/api/v1/products/productId/${id}`
  return axios.get(URL_BACKEND)
}





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

const checkDuplicateProductAPI = async (type, value) => {
  return await axios.post(`/api/v1/products/check-duplicate`, { type, value });
};
/* API Order*/
// const fetchDataOrders = () => {
//   const URL_BACKEND = "api/v1/orders/list";
//   return axios.get(URL_BACKEND);
// };
const fetchPendingOrders = (staffId) => {
  const URL_BACKEND = `api/v1/orders/pending?staffId=${staffId}`;
  return axios.get(URL_BACKEND);
};
const fetchPageDataProductDetail = async (
  productName,
  code,
  colorName,
  sizeName,
  minPrice,
  maxPrice,
  status,
  page = 0,
  limit = 10
) => {
  const URL_BACKEND = "api/v1/productDetail";
  const params = {
    productName: productName || "",
    code: code || "",
    colorName: colorName || "",
    sizeName: sizeName || "",
    minPrice: minPrice || "",
    maxPrice: maxPrice || "",
    status: status || "",
    page: page,
    limit: limit,
  };
  return axios.get(URL_BACKEND, { params });
};
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
const updateProductDetailWithOrder = (orderId, productDetail, voucherId) => {
  const URL_BACKEND = `api/v1/orders/update-productDetail/${orderId}`;
  const data = {
    orderDetailRequests: productDetail.map((item) => ({
      product_detail_id: item.product_detail_id,
      quantity: item.quantity,
      price: item.price,
    })),
    voucherId: voucherId,
  };
  return axios.put(URL_BACKEND, data);
};

const orderStaffFindById = (staffId) => {
  const URL_BACKEND = `api/v1/staff/${staffId}`;
  return axios.get(URL_BACKEND);
};
const orderFindByCode = (code) => {
  const URL_BACKEND = `api/v1/orders/find?code=${code}`;
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
  customerId,
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
    customerId: customerId,
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
const createOrderForOnline = async (
  code,
  orderDate,
  deliveryFee,
  totalAmount,
  voucherId,
  customerId,
  moneyReceived,
  orderDetailRequests
) => {
  const URL_BACKEND = "/api/v1/orders/add-online";
  const data = {
    code: code,
    orderDate: orderDate,
    deliveryFee: deliveryFee,
    totalAmount: totalAmount,
    voucherId: voucherId,
    moneyReceived: moneyReceived,
    customerId: customerId,
    orderDetailRequests: orderDetailRequests,
  };
  return axios.post(URL_BACKEND, data);
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
const getVouchersByCustomerId = (customerId) => {
  const URL_BACKEND = `api/v1/customer-voucher/${customerId}`;
  return axios.get(URL_BACKEND);
};
const hasCustomerUsedVoucher = (customerId, voucherId) => {
  const URL_BACKEND = `api/v1/orders/hasUsedVoucher/${customerId}/${voucherId}`;
  return axios.get(URL_BACKEND);
};
/*
  API Product detail
*/
const findByProductId = (productId) => {
  const URL_BACKEND = `/api/v1/products/${productId}`;
  return axios.get(URL_BACKEND);
};
const upLoadImageForProductDetail = (productId, id, formData) => {
  const URL_BACKEND = `/api/v1/products/uploadForProductDetail/${productId}/${id}`;
  return axios.post(URL_BACKEND, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
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
  defaultPrice,
  productId,
  sizeId,
  colorId,
  weightId
) => {
  const URL_BACKEND = "/api/v1/productDetail";
  const data = {
    code: code,
    quantity: quantity,
    defaultPrice: defaultPrice,
    productId: productId,
    sizeId: sizeId,
    colorId: colorId,
    weightId: weightId
  };
  return axios.post(URL_BACKEND, data);
};

const updateProductDetailAPi = (
  id,
  code,
  quantity,
  defaultPrice,
  productId,
  sizeId,
  colorId,
  status,
  weight,
) => {
  const URL_BACKEND = `/api/v1/productDetail/${id}`;
  const data = {
    code: code,
    quantity: quantity,
    defaultPrice: defaultPrice,
    productId: productId,
    sizeId: sizeId,
    colorId: colorId,
    status: status,
    weight: weight,
  };
  return axios.put(URL_BACKEND, data);
};

const deleteProductDetailAPI = (id) => {
  const URL_BACKEND = `/api/v1/productDetail/${id}`;
  return axios.delete(URL_BACKEND);
};
const findByProductDetailId = (id) => {
  const URL_BACKEND = `/api/v1/productDetail/detail/${id}`;
  return axios.get(URL_BACKEND);
};
const findByProductDetailCode = (code) => {
  const URL_BACKEND = `/api/v1/productDetail/detailCode/${code}`;
  return axios.get(URL_BACKEND);
};
//API color
const fetchDataColor = () => {
  const URL_BACKEND = "/api/v1/color";
  return axios.get(URL_BACKEND);
};
const createColorAPI = (code, name, status) => {
  const URL_BACKEND = "/api/v1/color";
  const data = {
    code: code,
    name: name,
    status: status,
  };
  return axios.post(URL_BACKEND, data);
};
// const checkCodeExistsAPI = (code, name, status) => {
//     const URL_BACKEND = "/api/v1/color"
//     const data = {
//         code: code,
//         name: name,
//         status: status
//     }
//     return axios.post(URL_BACKEND, data)
// }

const checkCodeExistsAPI = (code, name, status) => {
  const URL_BACKEND = "/api/v1/color";
  const data = {
    code: code,
    name: name,
    status: status,
  };
  return axios.post(URL_BACKEND, data);
};

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

const getAllPermission = () => {
  const URL_BACKEND = "/api/v1/permission/all";
  return axios.get(URL_BACKEND);
};
const getAllPermissionPagination = (page, size) => {
  const URL_BACKEND = `/api/v1/permission/getAll?page=${page}&size=${size}`;
  return axios.get(URL_BACKEND);
};
const createNewPermission = (name) => {
  const URL_BACKEND = "/api/v1/permission/";
  const data = {
    name: name,
  };
  return axios.post(URL_BACKEND, data);
};

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

const getAllStaff = async (page, size, username, phoneNumber) => {
  return axios.get(`/api/v1/staff/getAll`, {
    params: {
      page,
      size,
      username: username || "",
      phoneNumber: phoneNumber || "",
    },
  });
};
const getStaffPermissions = (id) => {
  const URL_BACKEND = `/api/v1/staff/${id}`;
  return axios.get(URL_BACKEND);
};
const updateStaffPermissions = (id, payload) => {
  const URL_BACKEND = `/api/v1/staff/update-permission/${id}`;
  return axios.put(URL_BACKEND, payload);
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
const deleteStaff = (id) => {
  const URL_BACKEND = `/api/v1/staff/soft-delete/${id}`;
  return axios.put(URL_BACKEND);
};
const updateStatus = (id) => {
  const URL_BACKEND = `/api/v1/staff/update-status/${id}`;
  return axios.put(URL_BACKEND);
};
//API Promotion

const fetchDataPromotion = () => {
  const URL_BACKEND = "/api/v1/promotion";
  return axios.get(URL_BACKEND);
};

const createPromotion = async (data) => {
  const URL_BACKEND = "/api/v1/promotion";

  try {
    const response = await axios.post(URL_BACKEND, data);
    return response; // Trả về phản hồi nếu thành công
  } catch (error) {
    return {
      data: null,
      message: error.response ? error.response.data : error.message,
    }; // Trả về thông tin lỗi
  }
};
// Hàm cập nhật khuyến mãi
const updatePromotion = (
  id,
  {
    name,
    description,
    startDate,
    endDate,
    discountPercent,
    discountAmount,
    status,
    productDetailsIds,
  }
) => {
  // Sửa 'productDetailsId' thành 'productDetailsIds'
  const URL_BACKEND = `/api/v1/promotion/${id}`; // Đường dẫn đến API cập nhật khuyến mãi
  const data = {
    name,
    description,
    startDate,
    endDate,
    discountPercent,
    discountAmount,
    status,
    productDetailsIds, // Chú ý tên trường ở đây
  };

  return axios.put(URL_BACKEND, data); // Gọi PUT với URL và dữ liệu
};
const updatePromotionProduct = async (id, payload) => {
  const URL_BACKEND = `/api/v1/promotion/${id}/product-details`;
  try {
    const response = await axios.put(URL_BACKEND, payload);
    return response.data; // Trả về dữ liệu từ phản hồi
  } catch (error) {
    // In chi tiết lỗi từ Axios để giúp debug dễ dàng hơn
    if (error.response) {
      console.error("Error response:", error.response.data);
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

const chandleStatusPromotion = (id) => {
  const URL_BACKEND = `/api/v1/promotion/${id}/status`;
  return axios.put(URL_BACKEND);
};

const detailPromotion = (id) => {
  const URL_BACKEND = `/api/v1/promotion/detail/${id}`;
  return axios.get(URL_BACKEND);
};

const deletePromotionAPI = (id) => {
  const URL_BACKEND = `/api/v1/promotion/${id}`;
  return axios.delete(URL_BACKEND);
};

// API VOUCHER
const fetchDataVoucher = () => {
  const URL_BACKEND = "/api/v1/voucher";
  return axios.get(URL_BACKEND);
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
  customers
) => {
  const URL_BACKEND = "/api/v1/voucher";
  const data = {
    code: code,
    quantity: quantity,
    discountAmount: discountAmount,
    discountPercent: discountPercent,
    expirationDate: expirationDate,
    minPurchaseAmount: minPurchaseAmount,
    maxDiscountAmount: maxDiscountAmount,
    termsAndConditions: termsAndConditions,
    // status,
    customers: customers,
  };
  return axios.post(URL_BACKEND, data);
};
const deleteVoucher = async (id) => {
  const URL_BACKEND = `/api/v1/voucher/${id}`;
  return axios.delete(URL_BACKEND);
};
const fetchVoucherById = (id) => {
  const URL_BACKEND = `/api/v1/voucher/detail/${id}`;
  return axios.get(URL_BACKEND);
};
const updateVoucher = async (
  id,
  {
    code,
    quantity,
    discountAmount,
    discountPercent,
    expirationDate,
    minPurchaseAmount,
    maxDiscountAmount,
    termsAndConditions,
  }
) => {
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
    status: 1, // Gán giá trị trạng thái mặc định là 1 (active)
  };
  return axios.put(URL_BACKEND, data);
};

const updateVoucherCustomer = async (id, payload) => {
  // Kiểm tra id trước khi xây dựng URL
  if (!id) {
    throw new Error("Voucher ID is required");
  }

  const URL_BACKEND = `/api/v1/voucher/${id}/customer`;
  try {
    const response = await axios.put(URL_BACKEND, payload);

    // Kiểm tra phản hồi
    if (response.status !== 200) {
      throw new Error(
        `Failed to update voucher customer: ${response.statusText}`
      );
    }

    return response.data; // Trả về dữ liệu từ phản hồi
  } catch (error) {
    console.error("Error updating voucher customer:", error); // Thay đổi thông điệp cho phù hợp
    throw error;
  }
};
//api crud customer
const getAllCustomer = (page, size) => {
  const URL_BACKEND = `/api/v1/customer/getAll?page=${page}&size=${size}`;
  return axios.get(URL_BACKEND);
};
const getCustomerById = (id) => {
  const URL_BACKEND = `/api/v1/customer/${id}`;
  return axios.get(URL_BACKEND);
};
const chandleStatus = (id) => {
  const URL_BACKEND = `/api/v1/voucher/${id}/status`;
  return axios.put(URL_BACKEND);
};
const updateCustomer = (
  id,
  username,
  password,
  email,
  address,
  phoneNumber,
  status,
  dateOfBirth,
  name,
  notes,
  gender
) => {
  const data = {
    username,
    password,
    email,
    address,
    phoneNumber,
    status,
    dateOfBirth,
    name,
    notes,
    gender,
  };
  const URL_BACKEND = `/api/v1/customer/${id}`;
  return axios.put(URL_BACKEND, data);
};

const updateCustomerInfo = (
  id,
  email,
  address,
  phoneNumber,
  dateOfBirth,
  gender,
  username
) => {
  const data = {
    email,
    address,
    phoneNumber,
    dateOfBirth,
    gender,
    username
  };
  const URL_BACKEND = `/api/v1/customer/${id}`;
  return axios.put(URL_BACKEND, data);
};

const createCustomer = (
  username,
  password,
  email,
  address,
  phoneNumber,
  dateOfBirth,
  name,
  notes,
  gender
) => {
  const URL_BACKEND = `/api/v1/customer/register`;
  const data = {
    username: username,
    password: password,
    email: email,
    address: address,
    phoneNumber: phoneNumber,
    status: 1,
    dateOfBirth: dateOfBirth, // Định dạng YYYY-MM-DD
    name: name,
    notes: notes,
    gender: gender, // 1 (male), 2 (female), 3 (other)
  };

  return axios.post(URL_BACKEND, data);
};

const softDelete = (id) => {
  const URL_BACKEND = `/api/v1/customer/soft-delete/${id}`;
  return axios.put(URL_BACKEND);
};

//Cart Detail
const fetchDataAPICartDetail = () => {
  const URL_BACKEND = "/api/v1/cartDetail";
  return axios.get(URL_BACKEND);
};

//API notice

const fetchDataNotice = () => {
  const URL_BACKEND = "/api/v1/notice/getAll";
  return axios.get(URL_BACKEND);
};
//API for forgot password
const requetsForgotPassword = (email) => {
  const URL_BACKEND = "/api/v1/auth/request-reset-password";
  return axios.post(URL_BACKEND, {
    email,
  });
};

const updatePassword = (email, code, newPassword) => {
  const URL_BACKEND = "/api/v1/auth/confirm-set-password";
  return axios.post(URL_BACKEND, {
    email,
    code,
    newPassword,
  });
};




//Weight
const fetchDataWeight = () => {
  const URL_BACKEND = "/api/v1/weight";
  return axios.get(URL_BACKEND);
}

const createWeightAPI = (code, name, status) => {
  const URL_BACKEND = "/api/v1/weight";
  const data = {
    code: code,
    name: name,
    status: status
  };
  return axios.post(URL_BACKEND, data)

}
const updateWeightAPI = (id, code, name, status) => {
  const URL_BACKEND = "/api/v1/weight";
  const data = {
    id: id,
    code: code,
    name: name,
    status: status,

  };
  return axios.put(URL_BACKEND, data)
}

//api for address

const getProvinces = () => {
  const URL_BACKEND = "/api/v1/ghn/provinces";
  return axios.get(URL_BACKEND)
}

const getDistrict = (provinceId) => {
  const URL_BACKEND = `/api/v1/ghn/districts?provinceId=${provinceId}`;
  return axios.get(URL_BACKEND)
}

const getWards = (districtId) => {
  const URL_BACKEND = `/api/v1/ghn/wards?districtId=${districtId}`;
  return axios.get(URL_BACKEND)
}

const getAddressByCustomerId = (customerId) => {
  const URL_BACKEND = `/api/v1/address/${customerId}`;
  return axios.get(URL_BACKEND);
}

export {
  createOrderForOnline,
  getAddressByCustomerId,
  getProvinces,
  getDistrict,
  getWards,
  updateCustomerInfo,
  getCustomerById,
  updateWeightAPI,
  fetchDataWeight,
  createWeightAPI,
  fetchDataProduct,
  fetchDataProductById,
  findByProductDetailId,
  updatePassword,
  requetsForgotPassword,
  fetchDataNotice,
  fetchDataAPICartDetail,
  fetchDataPageAndFilterProduct,
  updateStatus,
  getAllCustomer,
  updateCustomer,
  createCustomer,
  softDelete,
  fetchCustomerList,
  upLoadImageForProductDetail,
  uploadImageAPI,
  fetchDataPromotion,
  createPromotion,
  chandleStatusPromotion,
  deletePromotionAPI,
  updatePromotion,
  updatePromotionProduct,
  detailPromotion,
  fetchDataVoucher,
  deleteVoucher,
  createVoucher,
  fetchVoucherById,
  updateVoucher,
  updateVoucherCustomer,
  chandleStatus,
  updateStaffPermissions,
  deleteStaff,
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
  createProductAPI,
  fetchAllProduct,
  findByProductId,
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
  fetchPageDataProductDetail,
  checkDuplicateProductAPI,
  checkCodeExistsAPI,
  getUserInfo,
  updateProductDetailWithOrder,
  fetchPendingOrders,
  orderFindByCode,
  findByProductDetailCode,
  getVouchersByCustomerId,
  hasCustomerUsedVoucher,
};
