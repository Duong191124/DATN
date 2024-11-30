import React, { useEffect, useState } from 'react';
import { Button, message, notification, Steps, theme } from 'antd';
import './checkout.style.css';
import Summary from './checkout.summary';
import Payment from './checkout.payment';
import Shipping from './checkout.shipping';
import { createOrderForOnline, getCreateOrderGhn, getShippingFee } from '../../service/api.service';
import { useCart } from '../context/cart.context';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../context/checkout.context';

const steps = [
    {
        title: 'Order Summary',
        content: <Summary />,
    },
    {
        title: 'Shipping Details',
        content: <Shipping />,
    },
    {
        title: 'Payment',
        content: <Payment />,
    },
];

const CheckoutStep = () => {
    const { token } = theme.useToken();
    const { cartItems, setCartItems } = useCart();
    const {
        selectedCoupon,
        totalPriceAll,
        resetCheckoutContext,
        district,
        fromDistrict,
        ward,
        weight,
        serviceId,
        setTotalShippingFee,
        totalShippingFee,
        addresses,
        selectAddress,
    } = useCheckout();
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(false);
    const userId = localStorage.getItem('userId');

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const convertCartToOrderDetails = (cartItemsLocal) => {
        return cartItemsLocal.map(item => ({
            productDetailId: item.id,
            quantity: item.quantity,
            price: (item.discountPrice || item.defaultPrice)
        }));
    };

    const convertSelectAddressToOrder = (selectAddress) => {
        if (selectAddress && typeof selectAddress === 'object') {
            // Return only the selected fields
            return {
                name: selectAddress.name,
                phoneNumber: selectAddress.phoneNumber,
                city: selectAddress.city,
                district: selectAddress.district,
                ward: selectAddress.ward,
                addressDetail: selectAddress.addressDetail
            };
        } else {
            console.error("selectAddress is either null or not an object");
            return null;
        }
    }

    const convertDataProductToOrder = (cartItemsLocal) => {
        return cartItemsLocal.map(item => ({
            product: {
                name: item.productResponse.name,
                categoryName: item.productResponse.categoryName
            },
            code: item.code,
            quantity: item.quantity
        }));
    };

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
        setCartItems(items);
    }, [userId, setCartItems]);

    const generateInvoiceCode = () => {
        const randomCode = Math.floor(10000 + Math.random() * 90000);
        return `HD-${randomCode}`;
    };

    const confirmOrder = async () => {
        setLoading(true);
        const cartItemsLocal = cartItems;
        const orderDetailRequests = convertCartToOrderDetails(cartItemsLocal);
        const addressToOrder = convertSelectAddressToOrder(selectAddress);
        // const itemsProduct = convertDataProductToOrder(cartItemsLocal);

        const orderDTO = {
            code: generateInvoiceCode(), // Mã đơn hàng
            orderDate: new Date().toISOString().split("T")[0], // Ngày đặt hàng
            deliveryFee: totalShippingFee,  // Phí vận chuyển
            totalAmount: totalPriceAll,
            moneyReceived: totalPriceAll,
            voucherId: selectedCoupon || null,  // Mã giảm giá nếu có
            customerId: userId, // Lấy customerId từ localStorage hoặc session
            orderDetailRequests, // Dữ liệu sản phẩm trong đơn hàng
            addressToOrder
        };

        // const createOrderGhn = {
        //     toDistrictId: district,
        //     toWardCode: ward,
        //     weight: weight,
        //     paymentType: 2,
        //     shipCOD: totalShippingFee,
        //     customerName: addresses.name,
        //     customerPhone: addresses.phoneNumber,
        //     addressDetail: addresses.addressDetail,
        //     customerEmail: addresses?.customer?.email,
        //     itemsProduct
        // }

        try {
            // Step 1: Create the order in your system
            const createOrderResponse = await createOrderForOnline(
                orderDTO.code,
                orderDTO.orderDate,
                orderDTO.deliveryFee,
                orderDTO.totalAmount,
                orderDTO.voucherId,
                orderDTO.customerId,
                orderDTO.moneyReceived,
                orderDTO.orderDetailRequests,
                orderDTO.addressToOrder
            );


            // If creating the order fails, throw an error
            if (!createOrderResponse || createOrderResponse?.error) {
                throw new Error(createOrderResponse?.message);
            }

            // Step 2: Create the order in the GHN system (Shipping)
            // const createOrderGhnResponse = await getCreateOrderGhn(
            //     createOrderGhn.toDistrictId,
            //     createOrderGhn.toWardCode,
            //     createOrderGhn.weight,
            //     createOrderGhn.paymentType,
            //     createOrderGhn.shipCOD,
            //     createOrderGhn.customerName,
            //     createOrderGhn.customerPhone,
            //     createOrderGhn.addressDetail,
            //     createOrderGhn.customerEmail,
            //     createOrderGhn.itemsProduct
            // );

            // If there is any error in the GHN response, throw an error
            // if (createOrderGhnResponse?.error) {
            //     throw new Error(createOrderGhnResponse?.error || "Giao hàng không thành công.");
            // }

            // If both orders are successfully created, show success message
            message.success('Đơn hàng đã được tạo thành công!');
            resetCheckoutContext();
            localStorage.removeItem(`cart_${userId}`);
            setCartItems([]);
            navigate("/");
            setLoading(false);
        } catch (error) {
            // Catch and handle errors from both the order creation process or GHN
            let errorMessage = error?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.";

            // Handle insufficient stock error more clearly if it's the issue
            if (error?.message?.includes("Insufficient stock")) {
                errorMessage = "Số lượng sản phẩm không đủ trong kho!";
            }

            // Show the error message to the user
            message.error(errorMessage);
            setLoading(false);
            return;
        }
    };


    const handleApiGhn = async () => {
        const values = {
            fromDistrictId: selectAddress.fromDistrict,
            toDistrictId: selectAddress.district,
            toWardCode: selectAddress.ward,
            weight: weight,
            serviceId: selectAddress.serviceId,
        };
        try {
            const res = await getShippingFee(
                values.fromDistrictId,
                values.toDistrictId,
                values.toWardCode,
                values.weight,
                values.serviceId
            )
            setTotalShippingFee(res.data.data.total);
        } catch (error) {
            let errorMessage = error?.response?.data?.message || "Giao hàng nhanh không hỗ trợ xã này";

            // Cắt chuỗi để chỉ lấy phần từ "GHN" trở đi
            const ghnIndex = errorMessage.indexOf("Giao");
            if (ghnIndex !== -1) {
                errorMessage = errorMessage.substring(ghnIndex);
            }

            message.error(errorMessage);
        }
    }

    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));

    return (
        <>
            <Steps
                current={current}
                items={items}
                style={{ color: 'black' }} // Đặt màu chữ cho tiêu đề bước
                icon={<span style={{ color: 'black' }} />} // Đặt màu icon thành đen
                className='step'
            />
            <div>
                {/* Pass the necessary props to Summary */}
                {steps[current].content}
            </div>
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
                {current > 0 && (
                    <Button
                        style={{
                            backgroundColor: 'black',
                            borderColor: 'black',
                            color: 'white',
                            fontSize: "14px",
                            lineHeight: 1.5714285714285714,
                            height: "50px",
                            width: "100px",
                            padding: "4px 15px",
                            borderRadius: "6px",
                        }}
                        onClick={prev}
                    >
                        Previous
                    </Button>
                )}
                {current < steps.length - 1 && (
                    <Button
                        type="primary"
                        onClick={async () => {
                            if (cartItems.length === 0) {
                                notification.warning({
                                    message: 'Không có sản phẩm trong giỏ hàng',
                                    duration: 2
                                })
                                setCurrent(0);
                                return;
                            }
                            if (current === 1) {
                                await handleApiGhn();
                            }
                            next();
                        }}
                        style={{
                            backgroundColor: 'black',
                            borderColor: 'black',
                            color: 'white',
                            fontSize: "14px",
                            lineHeight: 1.5714285714285714,
                            height: "50px",
                            width: "100px",
                            padding: "4px 15px",
                            borderRadius: "6px",
                        }}
                    >
                        Next
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button
                        style={{
                            backgroundColor: 'black',
                            borderColor: 'black',
                            color: 'white',
                            fontSize: "14px",
                            lineHeight: 1.5714285714285714,
                            height: "50px",
                            width: "100px",
                            padding: "4px 15px",
                            borderRadius: "6px",
                        }}
                        type="primary"
                        onClick={confirmOrder}
                        loading={loading}
                    >
                        Confirm
                    </Button>
                )}
            </div>
        </>
    );
};

export default CheckoutStep;
