import React, { useState } from 'react';

const Payment = ({ totalPrice }) => {
    const [selectedOption, setSelectedOption] = useState('Cash');

    return (
        <>
            <div
                style={{
                    textAlign: 'center',
                    padding: '20px'
                }}
            >
                <h3>Payment</h3>
            </div>
            <div
                className="payment"
                style={{
                    height: 450,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <div style={{ width: '100%' }}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            border: '1px solid #ddd',
                            borderRadius: 8,
                            overflow: 'hidden'
                        }}
                    >
                        {/* VN Pay */}
                        <div
                            onClick={() => setSelectedOption('VN Pay')}
                            style={{
                                padding: '15px 20px',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                backgroundColor: selectedOption === 'VN Pay' ? '#f9f9f9' : '#fff',
                                borderBottom: '1px solid #ddd'
                            }}
                        >
                            <div
                                style={{
                                    marginRight: 10,
                                    width: 20,
                                    height: 20,
                                    borderRadius: '50%',
                                    border: '2px solid #000',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: selectedOption === 'VN Pay' ? '#000' : '#fff'
                                }}
                            >
                                {selectedOption === 'VN Pay' && (
                                    <span style={{ color: '#fff' }}>✓</span>
                                )}
                            </div>
                            <div style={{ flex: 1 }}>
                                <strong>VN Pay</strong>
                                <p style={{ margin: 0, color: '#888' }}>Pay securely through VN Pay.</p>
                            </div>
                        </div>

                        {/* Cash */}
                        <div
                            onClick={() => setSelectedOption('Cash')}
                            style={{
                                padding: '15px 20px',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                backgroundColor: selectedOption === 'Cash' ? '#f9f9f9' : '#fff'
                            }}
                        >
                            <div
                                style={{
                                    marginRight: 10,
                                    width: 20,
                                    height: 20,
                                    borderRadius: '50%',
                                    border: '2px solid #000',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: selectedOption === 'Cash' ? '#000' : '#fff'
                                }}
                            >
                                {selectedOption === 'Cash' && (
                                    <span style={{ color: '#fff' }}>✓</span>
                                )}
                            </div>
                            <div style={{ flex: 1 }}>
                                <strong>Cash</strong>
                                <p style={{ margin: 0, color: '#888' }}>Pay with cash upon delivery.</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'right', paddingTop: 20 }}>
                        <strong>Total:</strong>
                        <span style={{ fontSize: 24, marginLeft: 10 }}>${totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Payment;
