import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const CartBottom = () => {
    const navigate = useNavigate();
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #ddd',
        }}>
            <div>
                <p style={{ margin: 0, color: '#555' }}>Subtotal Amount:</p>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>$487.00</p>
            </div>
            <Button
                type="primary"
                style={{
                    backgroundColor: '#000',
                    color: '#fff',
                    padding: '10px 20px',
                    fontSize: '16px',
                    borderRadius: '0',
                    height: 'auto',
                    fontWeight: 'bold'
                }}
                onClick={() => {
                    navigate("/checkout")
                }}
            >
                CHECK OUT
            </Button>
        </div>
    );
};

export default CartBottom;
