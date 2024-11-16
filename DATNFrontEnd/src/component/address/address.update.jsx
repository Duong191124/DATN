import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
import { getDistrict, getProvinces, getWards } from "../../service/api.service";
import { Button, Checkbox, Modal } from "antd";

const AddressUpdateModal = ({ isModalOpen, handleCancelUpdate, handleSubmit, form, editingAddress }) => {
    // const { t, i18n } = useTranslation();
    // const language = localStorage.getItem("language") || "vi";
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);

    const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
    const [isWardDropdownOpen, setIsWardDropdownOpen] = useState(false);

    const defaultOption = { ProvinceID: '', DistrictID: '', WardCode: '', ProvinceName: ('MES-024'), DistrictName: ('MES-027'), WardName: ('MES-030') };

    // API gọi danh sách tỉnh
    useEffect(() => {
        const fetchProvinces = async () => {
            const res = await getProvinces();
            setProvinces([defaultOption, ...res.data.data]);
        };

        fetchProvinces();
    }, []);

    // useEffect(() => {
    //     i18n.changeLanguage(language);
    // }, [i18n, language]);

    useEffect(() => {
        if (selectedProvince && selectedProvince !== defaultOption.ProvinceID) {
            const fetchDistricts = async () => {
                const res = await getDistrict(selectedProvince);
                setDistricts([defaultOption, ...res.data.data]);
                setSelectedDistrict(defaultOption.DistrictID);
                setSelectedWard(defaultOption.WardCode);
                setIsDistrictDropdownOpen(true);
            };
            fetchDistricts();
        } else {
            setDistricts([]);
            setWards([]);
            setSelectedDistrict(null);
            setSelectedWard(null);
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict && selectedDistrict !== defaultOption.DistrictID) {
            const fetchWards = async () => {
                const res = await getWards(selectedDistrict);
                setWards([defaultOption, ...res.data.data]);
                setSelectedWard(defaultOption.WardCode);
                setIsWardDropdownOpen(true);
            };
            fetchWards();
        } else {
            setWards([]);
            setSelectedWard(null);
        }
    }, [selectedDistrict]);

    return (
        <Modal
            title="Địa chỉ của tôi"
            open={isModalOpen}
            onCancel={handleCancelUpdate}
            footer={null} // Disable default footer buttons
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '16px',
                    borderBottom: '1px solid #f0f0f0', // Add bottom border
                    marginBottom: '16px', // Space between items
                }}
            >
                <Checkbox />
                <div>
                    <p style={{ margin: 0 }}>Name | PhoneNumber</p>
                    <p style={{ margin: 0 }}>Provinces, District, Wards</p>
                </div>
                <Button type="primary">Chỉnh sửa</Button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button onClick={handleCancelUpdate}>Hủy</Button>
                <Button type="primary">
                    Áp dụng
                </Button>
            </div>
        </Modal>
    );
}

export default AddressUpdateModal;