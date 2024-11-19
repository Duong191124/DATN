import { Col, Row } from "antd";
import InfoPanel from "../component/info/info.panel";
import InfoAddress from "../component/info/info.address";
import InfoVoucher from "../component/info/info.voucher";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../component/context/auth.context";
import { getCustomerById } from "../service/api.service";

const InfoPage = () => {
    const { user } = useContext(AuthContext);

    useEffect(() => {

    }, [])

    return (
        <>
            <Row style={{ marginTop: 77, paddingBottom: 20 }}>
                <Col span={10}
                    style={{
                        backgroundColor: '#f8f8f8'
                    }
                    }
                >
                    <InfoPanel user={user} />
                </Col>
                <Col span={14}>
                    <Row style={{ height: "100%" }}>
                        <Col
                            span={24}
                            style={{
                                height: "40%",
                                borderRight: "2px solid #ccc",  // Đường viền bên phải
                                backgroundColor: "#f8f8f8",  // Màu nền nhẹ cho phần InfoAddress
                                padding: "16px",  // Thêm padding để tạo không gian bên trong
                                borderRadius: 10
                            }}
                        >
                            <InfoAddress user={user} />
                        </Col>
                        <Col
                            span={24}
                            style={{
                                height: "60%",
                                backgroundColor: "#f8f8f8",  // Màu nền trắng cho phần InfoVoucher
                                padding: "16px",  // Thêm padding cho phần này
                            }}
                        >
                            <InfoVoucher user={user} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
};

export default InfoPage;
