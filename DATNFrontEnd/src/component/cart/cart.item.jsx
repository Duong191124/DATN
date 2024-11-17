import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { MinusOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { useCart } from '../context/cart.context';

const CartItem = () => {
    const { cartItems, removeFromCart, setTotalAmount, updateQuantity } = useCart();

    const calculateTotal = () => {
        return cartItems.reduce((total, product) => {
            return total + ((product.discountPrice || product.defaultPrice) * (product.quantity || 1));
        }, 0);
    };

    useEffect(() => {
        const total = calculateTotal();
        setTotalAmount(total);
    }, [cartItems, setTotalAmount]);

    return (
        <div>
            {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '16px', color: 'gray' }}>
                    Your cart is empty.
                </div>
            ) : (
                cartItems.map((product) => (
                    <CartItemDetail key={product.id} product={product} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />
                ))
            )}
        </div>
    );
};

const CartItemDetail = ({ product, removeFromCart, updateQuantity }) => {
    const increaseQuantity = () => {
        updateQuantity(product.id, product.quantity + 1); // Update quantity in the context
    };

    // Function to decrease the quantity, but not allowing it to go below 1
    const decreaseQuantity = () => {
        if (product.quantity > 1) {
            updateQuantity(product.id, product.quantity - 1); // Update quantity in the context
        }
    };

    const handleRemove = () => {
        removeFromCart(product.id); // Xóa sản phẩm khỏi giỏ hàng
    };

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                flex: 1,
                minWidth: 0,
                justifyContent: 'space-between',
                border: '1px solid #ddd',
                padding: '16px',
                marginBottom: '16px'
            }}
        >
            {/* Hình ảnh sản phẩm */}
            <div style={{ display: 'flex', alignItems: 'center', width: '150px' }}>
                <img
                    src={product.image} // Thay bằng URL của hình ảnh thực tế
                    alt={product.name}
                    style={{ width: '80px', height: 'auto' }}
                />
            </div>

            {/* Thông tin sản phẩm */}
            <div style={{ flexGrow: 1, paddingLeft: '16px', paddingRight: '10px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{product.name}</div>
                <div style={{ display: 'flex', gap: '24px', color: 'gray', marginTop: '8px' }}>
                    <div>
                        <div>Quantity</div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                                onClick={decreaseQuantity}
                                icon={<MinusOutlined />}
                                size="small"
                                style={{ marginRight: '8px' }}
                            />
                            <span>{product.quantity}</span>
                            <Button
                                onClick={increaseQuantity}
                                icon={<PlusOutlined />}
                                size="small"
                                style={{ marginLeft: '8px' }}
                            />
                        </div>
                    </div>
                    <div>
                        <div>Size</div>
                        <div>{product.size}</div>
                    </div>
                    <div>
                        <div>Color</div>
                        <div style={{ width: '20px', height: '20px', backgroundColor: product.color, borderRadius: '50%', boxShadow: 'rgba(0, 0, 0, 0.88) 0px 0px 3px' }}></div>
                    </div>
                </div>
            </div>

            {/* Giá tiền */}
            <div style={{ fontWeight: 'bold', fontSize: '17px', marginRight: 'auto' }}>
                {product.discountPrice ? (
                    <>
                        <span style={{ textDecoration: 'line-through', color: 'gray', marginRight: '8px' }}>
                            ${product.defaultPrice}
                        </span>
                        <span style={{ color: 'red' }}>${product.discountPrice}</span>
                    </>
                ) : (
                    <span>${product.defaultPrice}</span>
                )}
            </div>

            {/* Nút Xóa */}
            <div style={{}}>
                <Button
                    type="text"
                    icon={<CloseOutlined />}
                    style={{
                        border: '1px solid black',
                        borderRadius: '4px',
                        padding: '4px 12px',
                        marginLeft: 10,
                    }}
                    onClick={handleRemove}
                />
            </div>
        </div>
    );
};

export default CartItem;
