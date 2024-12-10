import React, { useEffect } from 'react';
import { Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart.context';
import { useTranslation } from 'react-i18next';

const CartBottom = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const language = localStorage.getItem("language") || "vi";
    const { cartItems, totalAmount, formatCurrency } = useCart();

    useEffect(() => {
        i18n.changeLanguage(language);
    }, [i18n, language]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #ddd',
        }}>
            <div>
                <p style={{ margin: 0, color: '#555' }}>{t('MES-944')}:</p>
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
                        message.warning(t('MES-995'));
                    }
                }}
            >
                {t('MES-943')}
            </Button>
        </div>
    );
};

export default CartBottom;
