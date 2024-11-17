import React, { useEffect, useState } from 'react';
import { getUserInfo } from '../../service/api.service';

const Shipping = () => {
    // State variables for input values
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');

    useEffect(() => {
        getInformationForCustomer()
    }, [])

    const getInformationForCustomer = async () => {
        try {
            const res = await getUserInfo();
            console.log(res)
            setFullName(res.data.data.name)
            setEmail(res.data.data.email)
            setMobileNumber(res.data.data.phoneNumber)
        } catch (error) {
            console.error(error);
        }
    }


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
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '48%' }}>
                        <label>Mobile Number</label>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <select style={{ padding: '10px', marginRight: '5px' }}>
                                <option>VN +84</option>
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
            </div>
        </>
    );
}

export default Shipping;
