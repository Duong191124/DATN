import React, { useEffect, useState } from 'react';
import { getAddressByCustomerId, getUserInfo } from '../../service/api.service';
import AddressModal from '../address/address.select';
import AddressUpdateModal from '../address/address.update';
import { useCart } from '../context/cart.context';
import { useCheckout } from '../context/checkout.context';

const Shipping = () => {
    // State variables for input values
    const { cartItems } = useCart()
    const [district, setDistrict] = useState(0);
    const [fromDistrict, setFromDistrict] = useState(0);
    const [ward, setWard] = useState(null);
    const [weight, setWeight] = useState(0);
    const [serviceId, setServiceId] = useState(0);
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [isDisabled, setIsDisabled] = useState(true); // State to manage input fields' disabled status
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        getInformationForCustomer();
    }, []);

    const getInformationForCustomer = async () => {
        try {
            const res = await getUserInfo();
            const addressData = await getAddressByCustomerId(res.data.data.id);
            console.log(cartItems[0].weight.weightValue);
            if (addressData?.data?.data && addressData.data.data.length > 0) {
                // Duyệt qua tất cả địa chỉ
                addressData.data.data.forEach(address => {
                    if (address) {
                        setAddress(prev => [...prev, address.addressDetail]);  // Cập nhật state với địa chỉ mới
                        setFullName(prev => [...prev, address?.name || ""]);
                        setMobileNumber(prev => [...prev, address?.phoneNumber || ""]);
                        setDistrict(prev => [...prev, address.district || 0]);
                        setFromDistrict(prev => [...prev, address.fromDistrict || 0])
                        setWard(prev => [...prev, address.ward || ""])
                    }
                });
            }
            if (cartItems.length > 0) {
                cartItems.forEach(cart => {
                    setWeight(cart.weight?.weightValue || 0)
                })
            }
            console.log(setWeight())
            // setWeight(cartItems)
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddNewAddress = () => {
        setIsModalVisible(true);
    };

    const handleOpenAddressUpdate = () => {
        setIsModalOpen(true);
    };

    const handleCancelUpdate = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSubmit = (values) => {
        console.log('Submitted values:', values);
        setIsModalVisible(false);
    };

    return (
        <>
            <div
                className="shipping"
                style={{
                    margin: '0 auto',
                    padding: '20px',
                }}
            >
                {/* Shipping Details Form */}
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <h3>Shipping Details</h3>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <button
                        onClick={handleOpenAddressUpdate} // Add your change address functionality here
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#1890ff',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        Thay đổi địa chỉ
                    </button>
                    <button
                        onClick={handleAddNewAddress}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#52c41a',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        Thêm mới địa chỉ
                    </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <div style={{ width: '48%' }}>
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter full name"
                            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                            disabled={isDisabled} // Disable input if isDisabled is true
                        />
                    </div>
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Shipping Address</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter address"
                        style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                        disabled={isDisabled} // Disable input if isDisabled is true
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '48%' }}>
                        <label>Mobile Number</label>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <select style={{ padding: '10px', marginRight: '5px' }} disabled={isDisabled}>
                                <option>VN +84</option>
                            </select>
                            <input
                                type="text"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                placeholder="Enter mobile number"
                                style={{ width: '100%', padding: '10px' }}
                                disabled={isDisabled} // Disable input if isDisabled is true
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* Address Modal */}
            <AddressModal
                isModalVisible={isModalVisible}
                handleCancel={handleCancel}
                handleSubmit={handleSubmit}
            />
            <AddressUpdateModal
                isModalOpen={isModalOpen}
                handleCancelUpdate={handleCancelUpdate}
                handleSubmit={handleSubmit}
            />
        </>
    );
};

export default Shipping;
