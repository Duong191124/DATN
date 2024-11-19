import React, { useEffect, useState } from 'react';
import { getAddressByCustomerId, getUserInfo } from '../../service/api.service';
import AddressModal from '../address/address.select';
import AddressUpdateModal from '../address/address.update';
import { useCart } from '../context/cart.context';
import { useCheckout } from '../context/checkout.context';
import { Form } from 'antd';

const Shipping = () => {
    // State variables for input values
    const { cartItems } = useCart()
    const {
        setDistrict,
        setFromDistrict,
        setWard,
        setWeight,
        setServiceId,
        setAddresses,
        addresses,
    } = useCheckout();
    const [form] = Form.useForm();
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [isDisabled, setIsDisabled] = useState(true); // State to manage input fields' disabled status
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasAddress, setHasAddress] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    useEffect(() => {
        getInformationForCustomer()
    }, []);

    const getInformationForCustomer = async () => {
        try {
            const res = await getUserInfo();
            const addressData = await getAddressByCustomerId(res.data.data.id);
            if (addressData?.data?.data && addressData.data.data.length > 0) {
                setHasAddress(true);
                // Duyệt qua tất cả địa chỉ
                setAddresses(addressData.data.data);
                const defaultAddress = addressData.data.data[0];
                if (defaultAddress) {
                    setFullName(defaultAddress.name);
                    setAddress(defaultAddress.addressDetail);
                    setMobileNumber(defaultAddress.phoneNumber);
                    setDistrict(defaultAddress.district);
                    setFromDistrict(defaultAddress.fromDistrict);
                    setWard(defaultAddress.ward);
                    setServiceId(defaultAddress.serviceId);
                }
            }
            else {
                setHasAddress(false);
            }
            cartItems.forEach(cart => {
                if (cart) {
                    setWeight(cart.weight.weightValue);
                }
            })
        } catch (error) {
            console.error(error);
        }
    };

    const showModal = (addresses) => {
        addresses.forEach(address => {
            setEditingAddress(address);
            if (address) {
                form.setFieldsValue(address); // Pre-fill form with address details
            } else {
                form.resetFields(); // Clear form for new address
            }
        })
        setIsModalVisible(true);
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
                        // onClick={handleOpenAddressUpdate} // Add your change address functionality here
                        onClick={() => showModal(addresses)}
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
                        disabled={hasAddress}
                    >
                        Thêm mới địa chỉ
                    </button>
                </div>
                <div style={{ display: 'flex', marginBottom: '15px', gap: '10px' }}>
                    <label style={{ fontWeight: '600', fontSize: '20px' }}>{fullName}</label>
                    <label style={{ fontWeight: '600', fontSize: '20px' }}>{mobileNumber}</label>
                    <label style={{ fontWeight: '400', fontSize: '14px' }}>{addresses.addressDetail}, {addresses.ward}, {addresses.district}, {addresses.city}</label>
                </div>
            </div>
            {/* Address Modal */}
            <AddressModal
                isModalVisible={isModalVisible}
                handleCancel={handleCancel}
                setIsModalVisible={setIsModalVisible}
                form={form}
                editingAddress={editingAddress}
                getAddressByid={getInformationForCustomer}
            />
            {/* <AddressUpdateModal
                isModalOpen={isModalOpen}
                handleCancelUpdate={handleCancelUpdate}
                handleSubmit={handleSubmit}
            /> */}
        </>
    );
};

export default Shipping;
