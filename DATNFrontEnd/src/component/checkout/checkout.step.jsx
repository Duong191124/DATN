import React, { useEffect, useState } from 'react';
import { Button, message, Steps, theme } from 'antd';
import './checkout.style.css';
import Summary from './checkout.summary';
import Payment from './checkout.payment';
import Shipping from './checkout.shipping';
import { createOrderForOnline } from '../../service/api.service';
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
    const { selectedCoupon, totalPrice, resetCheckoutContext } = useCheckout();
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

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
        setCartItems(items);
    }, [userId, setCartItems]);

    const generateInvoiceCode = () => {
        const randomCode = Math.floor(10000 + Math.random() * 90000);
        return `HD-${randomCode}`;
    };

    const confirmOrder = async () => {
        const cartItemsLocal = cartItems;
        const orderDetailRequests = convertCartToOrderDetails(cartItemsLocal);

        const orderDTO = {
            code: generateInvoiceCode(), // Mã đơn hàng
            orderDate: new Date().toISOString().split("T")[0], // Ngày đặt hàng
            deliveryFee: 0,  // Phí vận chuyển
            totalAmount: totalPrice,
            moneyReceived: totalPrice,
            voucherId: selectedCoupon || null,  // Mã giảm giá nếu có
            customerId: userId, // Lấy customerId từ localStorage hoặc session
            orderDetailRequests, // Dữ liệu sản phẩm trong đơn hàng
        };


        try {
            const res = await createOrderForOnline(
                orderDTO.code,
                orderDTO.orderDate,
                orderDTO.deliveryFee,
                orderDTO.totalAmount,
                orderDTO.voucherId,
                orderDTO.customerId,
                orderDTO.moneyReceived,
                orderDTO.orderDetailRequests
            );
            console.log(res);
            message.success('Đơn hàng đã được tạo thành công!');
            resetCheckoutContext();
        } catch (error) {
            message.error("Lỗi khi tạo đơn hàng: " + error.message);
        }
        localStorage.removeItem(`cart_${userId}`);
        setCartItems([]);
        navigate("/")
    };

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
                        onClick={next}
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
