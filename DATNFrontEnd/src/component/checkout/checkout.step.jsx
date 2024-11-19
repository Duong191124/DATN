import React, { useEffect, useState } from 'react';
import { Button, message, Steps, theme } from 'antd';
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
        addresses
    } = useCheckout();
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);
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

    const convertDataProductToOrder = (cartItemsLocal) => {
        return cartItemsLocal.map(item => ({
            name: item.productResponse.name,
            code: item.code,
            quantity: item.quantity,
            category: item.productResponse.categoryName
        }))
    };

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
        setCartItems(items);
    }, [userId, setCartItems]);

    const generateInvoiceCode = () => {
        const randomCode = Math.floor(10000 + Math.random() * 90000);
        return `HD-${randomCode}`;
    };

    console.log(addresses);

    const confirmOrder = async () => {
        const cartItemsLocal = cartItems;
        const orderDetailRequests = convertCartToOrderDetails(cartItemsLocal);
        const items = convertDataProductToOrder(cartItemsLocal);

        const orderDTO = {
            code: generateInvoiceCode(), // Mã đơn hàng
            orderDate: new Date().toISOString().split("T")[0], // Ngày đặt hàng
            deliveryFee: totalShippingFee,  // Phí vận chuyển
            totalAmount: totalPriceAll,
            moneyReceived: totalPriceAll,
            voucherId: selectedCoupon || null,  // Mã giảm giá nếu có
            customerId: userId, // Lấy customerId từ localStorage hoặc session
            orderDetailRequests, // Dữ liệu sản phẩm trong đơn hàng
        };

        const createOrderGhn = {
            toDistrictId: district,
            toWardCode: ward,
            weight: weight,
            paymentType: 2,
            shipCOD: totalShippingFee,
            customerName: addresses.name,
            customerPhone: addresses.phoneNumber,
            addressDetail: addresses.addressDetail,
            customerEmail: addresses?.customer?.email,
            items
        }

        try {
            await createOrderForOnline(
                orderDTO.code,
                orderDTO.orderDate,
                orderDTO.deliveryFee,
                orderDTO.totalAmount,
                orderDTO.voucherId,
                orderDTO.customerId,
                orderDTO.moneyReceived,
                orderDTO.orderDetailRequests
            );
            message.success('Đơn hàng đã được tạo thành công!');
            const res = await getCreateOrderGhn(
                createOrderGhn.toDistrictId,
                createOrderGhn.toWardCode,
                createOrderGhn.weight,
                createOrderGhn.paymentType,
                createOrderGhn.shipCOD,
                createOrderGhn.customerName,
                createOrderGhn.customerPhone,
                createOrderGhn.addressDetail,
                createOrderGhn.customerEmail,
                createOrderGhn.items,
            )
            console.log(res);
            resetCheckoutContext();
        } catch (error) {
            message.error("Lỗi khi tạo đơn hàng: " + error.message);
        }
        localStorage.removeItem(`cart_${userId}`);
        setCartItems([]);
        navigate("/")
    };

    const handleApiGhn = async () => {
        const values = {
            fromDistrictId: fromDistrict,
            toDistrictId: district,
            toWardCode: ward,
            weight: weight,
            serviceId: serviceId,
        };
        try {
            const res = await getShippingFee(
                values.fromDistrictId,
                values.toDistrictId,
                values.toWardCode,
                values.weight,
                values.serviceId
            )
            console.log(res);
            setTotalShippingFee(res.data.data.total);
        } catch (error) {
            console.error(error)
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
                    >
                        Confirm
                    </Button>
                )}
            </div>
        </>
    );
};

export default CheckoutStep;
