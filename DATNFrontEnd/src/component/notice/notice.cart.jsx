import React from "react";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import { BellOutlined } from "@ant-design/icons";
import moment from "moment";

const NoticeCart = ({ title, content, date, link, setOpenNotice }) => {
    const navigate = useNavigate();

    // Handle card click
    const handleCardClick = () => {
        setOpenNotice(false);
        navigate(link);
    };

    // Format the date
    const formattedDate = moment(date).format("DD/MM/YY - HH:mm");
    return (
        <>
            <Card
                title={
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <BellOutlined style={{ color: "#1890ff", fontSize: 24, marginRight: 10 }} />
                            <span>{title}</span>
                        </div>
                        <span style={{
                            backgroundColor: "#f0f5ff", // Màu nền cho tag
                            color: "#1890ff", // Màu chữ
                            borderRadius: 15,
                            padding: "5px 10px",
                            fontSize: 14,
                            fontWeight: 500,
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Đổ bóng nhẹ
                        }}>
                            {formattedDate}
                        </span>
                    </div>
                }
                bordered={false}
                style={{
                    width: "100%",
                    margin: "20px auto",
                    borderRadius: 10,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    cursor: "pointer",
                    transition: "transform 0.3s, box-shadow 0.3s",
                }}
                bodyStyle={{
                    padding: 20,
                }}
                onClick={handleCardClick}
                hoverable
                className="custom-card"
            >
                <p style={{ fontSize: 16, color: "#595959" }}>
                    {content}, click here to view details.
                </p>
            </Card>
        </>
    );
};

export default NoticeCart;
