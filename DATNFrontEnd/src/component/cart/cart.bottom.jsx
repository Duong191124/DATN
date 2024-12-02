import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart.context';

const CartBottom = () => {
    const navigate = useNavigate();
    const { cartItems, totalAmount, formatCurrency } = useCart();

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #ddd',
        }}>
            <div>
                <p style={{ margin: 0, color: '#555' }}>Subtotal Amount:</p>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{formatCurrency(totalAmount)}</p>
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
                    if (cartItems.length > 0) {
                        navigate("/checkout");  // Check if cartItems are not empty
                    } else {
                        alert("Your cart is empty!");
                    }
                }}
            >
                CHECK OUT
            </Button>
        </div>
    );
};

export default CartBottom;
