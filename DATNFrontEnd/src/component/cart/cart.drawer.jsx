import React from 'react';
import { Button, Drawer } from 'antd';
import CartItem from './cart.item';
import CartBottom from './cart.bottom';
import './cart.style.css'
const CartDrawer = ({ openCart, setOpenCart }) => {

    const showDrawer = () => {
        setOpenCart(true);
    };
    const onClose = () => {
        setOpenCart(false);
    };

    return (
        <>
            <Drawer
                title="My cart"
                width={600}
                onClose={onClose}
                open={openCart}
                extra={
                    <Button>
                        Clear all
                    </Button>
                }
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100vh',
                        border: '1px solid #ddd',
                    }}
                >
                    {/* Phần chứa các CartItem */}
                    <div
                        style={{
                            flexGrow: 1,
                            overflowY: 'auto',
                            padding: '16px',
                            borderBottom: '1px solid #ddd',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                        }}
                    >
                        <CartItem />
                        <CartItem />
                        <CartItem />
                        <CartItem />
                        <CartItem />
                        <CartItem />
                    </div>

                </div>
                {/* Phần CartBottom luôn dính dưới */}
                <div
                    style={{
                        position: 'sticky',
                        bottom: 0, // Dính vào đáy
                        borderTop: '1px solid #ddd',
                        height: 80,
                        width: '100%',
                        backgroundColor: 'white'
                    }}
                >
                    <CartBottom />
                </div>
            </Drawer>
        </>
    );
};

export default CartDrawer;
