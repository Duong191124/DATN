import React, { useState } from 'react';
import { Button, message, Steps, theme } from 'antd';
import './checkout.style.css'
import Summary from './checkout.summary';
import Payment from './checkout.payment';
import Shipping from './checkout.shipping';
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
    const [current, setCurrent] = useState(0);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
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
                        onClick={() => prev()}
                    >
                        Previous
                    </Button>
                )}
                {current < steps.length - 1 && (
                    <Button
                        type="primary"
                        onClick={() => next()}
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
                        onClick={() => message.success('Processing complete!')}
                    >
                        Confirm
                    </Button>
                )}
            </div>
        </>
    );
};

export default CheckoutStep;
