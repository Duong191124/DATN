import { NavLink } from "react-router-dom";
import "./footer.css";
import { Flex, Tag } from "antd";
import {
  FacebookOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
const Footer = () => {
  return (
    <>
      <div className="footer">
        <div className="footer-container">
          <div className="row">
            <div className="col-3">
              <h2>Giới thiệu</h2>
              <div className="footer-content">
                <NavLink to={"/"} className={"p"}>
                  Về cửa hàng chúng tôi
                </NavLink>
                <NavLink to={"/"} className={"p"}>
                  Tuyển nhân viên
                </NavLink>
                <NavLink to={"/"} className={"p"}>
                  Lịch sử hình thành
                </NavLink>
                <NavLink to={"/"} className={"p"}>
                  Các chi nhánh
                </NavLink>
              </div>
            </div>
            <div className="col-3">
              <h2>Hỗ Trợ Khách Hàng</h2>
              <div className="footer-content">
                <NavLink to={"/"} className={"p"}>
                  Liên hệ CSKH
                </NavLink>
                <NavLink to={"/"} className={"p"}>
                  Hướng dẫn đặt hàng
                </NavLink>
                <NavLink to={"/"} className={"p"}>
                  Quy trình trả hàng trực tuyến
                </NavLink>
                <NavLink to={"/"} className={"p"}>
                  Phương thức giao hàng
                </NavLink>
              </div>
            </div>
            <div className="col-3">
              <h2>Liên hệ</h2>
              <p className="phone">0999.99.99.99</p>
              <div className="footer-content">
                <p>
                  LIÊN HỆ BẢO HÀNH
                  <br />
                  <span>022.2222.2222</span>
                </p>
                <p>
                  LIÊN HỆ HỢP TÁC
                  <br />
                  <span>03.3333.3333</span>
                </p>
              </div>
            </div>
            <div className="col-3">
              <h2>Liên kết</h2>
              <div className="footer-content">
                <Flex gap="25px" wrap className="connect">
                  <Tag
                    icon={<TwitterOutlined />}
                    color="#55acee"
                    className={"twitter"}
                  >
                    Twitter
                  </Tag>
                  <Tag
                    icon={<YoutubeOutlined />}
                    color="#cd201f"
                    className="youtube"
                  >
                    Youtube
                  </Tag>
                  <Tag
                    icon={<FacebookOutlined />}
                    color="#3b5999"
                    className="facebook"
                  >
                    Facebook
                  </Tag>
                  <Tag
                    icon={<LinkedinOutlined />}
                    color="#55acee"
                    className="linkedin"
                  >
                    <NavLink to={"https://ant.design/components/flex"}>
                      LinkedIn
                    </NavLink>
                  </Tag>
                </Flex>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            Copyright © 2024
            <NavLink to={"/"} className={"name-brand"}>
              SPORTS SHIRT
            </NavLink>
            <NavLink to={"/"} className={"image-footer-bottom"}>
              <img src="https://theme.hstatic.net/200000174405/1001111911/14/logo_bct.png?v=1275" />
            </NavLink>
          </p>
        </div>
      </div>
    </>
  );
};
export default Footer;
