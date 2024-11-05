import React, { useState } from 'react';

const Shipping = () => {
    // State variables for input values
    const [fullName, setFullName] = useState('Dan Robert');
    const [email, setEmail] = useState('huudung2004kt@gmail.com');
    const [address, setAddress] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [shippingCost, setShippingCost] = useState(50);
    const [subtotal, setSubtotal] = useState(329);

    // Calculate the total dynamically
    const total = subtotal + shippingCost;

    return (
        <>
            <div
                style={{
                    textAlign: 'center',
                    padding: '20px'
                }}
            >
                <h3>Shipping Details</h3>
            </div>
            <div
                className="shipping"
                style={{
                    margin: '0 auto',
                    padding: '20px',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <div style={{ width: '48%' }}>
                        <label>* Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter full name"
                            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                        />
                    </div>
                    <div style={{ width: '48%' }}>
                        <label>* Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email"
                            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                        />
                    </div>
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>* Shipping Address</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter address"
                        style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <div style={{ width: '48%' }}>
                        <label>Mobile Number</label>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <select style={{ padding: '10px', marginRight: '5px' }}>
                                <option>🇵🇭 +63</option>
                            </select>
                            <input
                                type="text"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                placeholder="Enter mobile number"
                                style={{ width: '100%', padding: '10px' }}
                            />
                        </div>
                    </div>
                </div>
                <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                    <input
                        type="radio"
                        id="international1"
                        name="shipping"
                        checked
                        onChange={() => setShippingCost(90)} // Set the shipping cost when selected
                        style={{ marginRight: '10px' }}
                    />
                    <label htmlFor="international">Supper Shipping 3-5 days</label>
                    <span style={{ float: 'right', fontWeight: 'bold' }}>${shippingCost}.00</span>
                </div>
                <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                    <input
                        type="radio"
                        id="international2"
                        name="shipping"
                        checked
                        onChange={() => setShippingCost(50)} // Set the shipping cost when selected
                        style={{ marginRight: '10px' }}
                    />
                    <label htmlFor="international">International Shipping 7-14 days</label>
                    <span style={{ float: 'right', fontWeight: 'bold' }}>${shippingCost}.00</span>
                </div>
            </div>
        </>
    );
}

export default Shipping;
