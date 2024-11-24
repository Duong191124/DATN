import React, { useContext, useState } from "react";
import { animated, useSprings } from "react-spring";
import Arm1 from "../login/Arm1.jsx";
import Arm2 from "../login/Arm2.jsx";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { getUserInfo, loginCustomerAPI } from "../../service/api.service.jsx";
import { AuthContext } from "../context/auth.context.jsx";
import { useCart } from "../context/cart.context.jsx";
const LoginAnimation = () => {
  const [form] = Form.useForm();

  const [loginImage, setloginImage] = useState(
    "https://res.cloudinary.com/dfqs9as0v/image/upload/v1683480418/defaultYeti_atdp3z.svg"
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [normal, setNormal] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [cheat, setCheat] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setLoginStatus, setRole } = useContext(AuthContext);
  const { setCartItems } = useCart();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    if (event.target.value.length < 5) {
      setloginImage(
        "https://res.cloudinary.com/dfqs9as0v/image/upload/v1683875080/svgTypingStarts_yxtpvl_iceuft.svg"
      );
    } else if (event.target.value.length < 10) {
      setloginImage(
        "https://res.cloudinary.com/dfqs9as0v/image/upload/v1683875080/Typing_in_between_pxmeqa_vxkleu.svg"
      );
    } else {
      setloginImage(
        "https://res.cloudinary.com/dfqs9as0v/image/upload/v1683875080/typing_ends_ewpfnp_k7z7ko.svg"
      );
    }
    // changeLoginImage();
  };

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const res = await loginCustomerAPI(values.username, values.password);
      console.log(res);
      if (res.status === 200 || res.status === 201) {
        localStorage.setItem("access_token", res.data.token);

        const userInfoRes = await getUserInfo(res.data.token);
        console.log(userInfoRes);
        if (userInfoRes.status === 200) {
          localStorage.setItem("userId", userInfoRes.data.data.id);
          const userCart = JSON.parse(localStorage.getItem(`cart_${userInfoRes.data.data.id}`)) || [];
          setCartItems(userCart);
          setUser(userInfoRes.data.data);
          setLoginStatus(res.status.toString());
          setRole(res.data.role);
          message.success("Đăng nhập thành công");
          navigate(res.status === 200 ? "/" : "/admin");
        }
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        form.setFields([
          {
            name: "username",
            errors: ["Username or password is not valid"],
          },
          {
            name: "password",
            errors: ["Username or password is not valid"],
          },
        ]);
      } else {
        message.error("Đăng nhập thất bại, vui lòng thử lại.");
        console.error(error);
      }
      setLoading(false);
    }
  };

  const onFinish = (values) => {
    handleLogin(values);
  };

  const changeToUsernameImage = () => {
    if (username.length < 5) {
      setloginImage(
        "https://res.cloudinary.com/dfqs9as0v/image/upload/v1683875080/svgTypingStarts_yxtpvl_iceuft.svg"
      );
    } else if (username.length < 10) {
      setloginImage(
        "https://res.cloudinary.com/dfqs9as0v/image/upload/v1683875080/Typing_in_between_pxmeqa_vxkleu.svg"
      );
    } else {
      setloginImage(
        "https://res.cloudinary.com/dfqs9as0v/image/upload/v1683875080/typing_ends_ewpfnp_k7z7ko.svg"
      );
    }
  };

  const changeToDefault = () => {
    setloginImage(
      "https://res.cloudinary.com/dfqs9as0v/image/upload/v1683875080/defaultYeti_atdp3z_pm9ewy.svg"
    );

    setNormal(true);
    setToggle(false);
  };

  const changeToPasswordImage = () => {
    setloginImage(
      "https://res.cloudinary.com/dfqs9as0v/image/upload/v1683480422/onTypingPassword_b4ur9v.svg"
    );
    setNormal(false);
    setTimeout(() => {
      setToggle(true);
    }, 100);
  };

  const handlePasswordChange = (event) => {
    const password = event.target.value;
    setPassword(event.target.value);
    if (password.length >= 3 && password.length < 7) {
      setCheat(true);
    } else {
      setCheat(false);
    }
    // setToggle(true);
  };

  const inputStyle = {
    height: '40px',
    borderRadius: '4px',
    border: '1px solid #d9d9d9'
  };

  const arms = [<Arm1 key="arm-1" cheat={cheat} />, <Arm2 key="arm-2" />];
  const argOb = arms.map((_, i) => ({
    transform: toggle
      ? "translate3d(0px,15px,0px)"
      : "translate3d(0px,400px,0px)",
    opacity: toggle ? 1 : 0,
    delay: i * 100,
  }));
  const springs = useSprings(2, argOb);

  const animatedArms = springs.map((animatedStyle, index) => (
    <animated.g key={index} style={animatedStyle}>
      {arms[index]}
    </animated.g>
  ));

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        border: "1px black solid",
        backgroundColor: "rgb(240, 242, 245)",
      }}
    >
      <div className="bg-container-login">
        <div style={{
          width: 300
        }}>
          <Form
            onFinish={onFinish}
            form={form}
            layout="vertical"
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "30px",
              borderRadius: "1",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.5)",
              width: "350px",
              margin: "auto",
              color: "#333",
              fontFamily: "Arial, sans-serif",
              marginBottom: 60,
              backgroundColor: 'white',

            }}
          >
            <div>
              <h1 style={{
                textAlign: 'center'
              }}>Login Form</h1>
            </div>
            <div>
              <div className="fade-in">
                {normal && (
                  <animated.img
                    alt="yeti"
                    className="yeti-image img-transition"
                    src={loginImage}
                  />
                )}
                {!normal && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    className="mySVG"
                    viewBox="0 0 200 200"
                  >
                    <defs>
                      <circle id="armMaskPath" cx="100" cy="100" r="100"></circle>
                    </defs>
                    <clipPath id="armMask">
                      <use overflow="visible" xlinkHref="#armMaskPath"></use>
                    </clipPath>
                    <circle cx="100" cy="100" r="100" fill="#f4364c"></circle>
                    <g className="body">
                      <path
                        fill="#FFF"
                        d="M193.3 135.9c-5.8-8.4-15.5-13.9-26.5-13.9H151V72c0-27.6-22.4-50-50-50S51 44.4 51 72v50H32.1c-10.6 0-20 5.1-25.8 13v78h187v-77.1z"
                      ></path>
                      <path
                        fill="none"
                        stroke="#3A5E77"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        d="M193.3 135.9c-5.8-8.4-15.5-13.9-26.5-13.9H151V72c0-27.6-22.4-50-50-50S51 44.4 51 72v50H32.1c-10.6 0-20 5.1-25.8 13"
                      ></path>
                      <path
                        fill="#DDF1FA"
                        d="M100 156.4c-22.9 0-43 11.1-54.1 27.7 15.6 10 34.2 15.9 54.1 15.9s38.5-5.8 54.1-15.9c-11.1-16.6-31.2-27.7-54.1-27.7z"
                      ></path>
                    </g>
                    <g className="earL">
                      <g
                        fill="#ddf1fa"
                        stroke="#3a5e77"
                        strokeWidth="2.5"
                        className="outerEar"
                      >
                        <circle cx="47" cy="83" r="11.5"></circle>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M46.3 78.9c-2.3 0-4.1 1.9-4.1 4.1 0 2.3 1.9 4.1 4.1 4.1"
                        ></path>
                      </g>
                      <g className="earHair">
                        <path fill="#FFF" d="M51 64H66V99H51z"></path>
                        <path
                          fill="#fff"
                          stroke="#3a5e77"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M53.4 62.8C48.5 67.4 45 72.2 42.8 77c3.4-.1 6.8-.1 10.1.1-4 3.7-6.8 7.6-8.2 11.6 2.1 0 4.2 0 6.3.2-2.6 4.1-3.8 8.3-3.7 12.5 1.2-.7 3.4-1.4 5.2-1.9"
                        ></path>
                      </g>
                    </g>
                    <g className="earR">
                      <g
                        fill="#ddf1fa"
                        stroke="#3a5e77"
                        strokeWidth="2.5"
                        className="outerEar"
                      >
                        <circle cx="155" cy="83" r="11.5"></circle>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M155.7 78.9c2.3 0 4.1 1.9 4.1 4.1 0 2.3-1.9 4.1-4.1 4.1"
                        ></path>
                      </g>
                      <g className="earHair">
                        <path fill="#FFF" d="M131 64H151V99H131z"></path>
                        <path
                          fill="#fff"
                          stroke="#3a5e77"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M148.6 62.8c4.9 4.6 8.4 9.4 10.6 14.2-3.4-.1-6.8-.1-10.1.1 4 3.7 6.8 7.6 8.2 11.6-2.1 0-4.2 0-6.3.2 2.6 4.1 3.8 8.3 3.7 12.5-1.2-.7-3.4-1.4-5.2-1.9"
                        ></path>
                      </g>
                    </g>
                    <path
                      fill="none"
                      stroke="#3a5e77"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M84.1 121.6c2.7 2.9 6.1 5.4 9.8 7.5l.9-4.5c2.9 2.5 6.3 4.8 10.2 6.5 0-1.9-.1-3.9-.2-5.8 3 1.2 6.2 2 9.7 2.5-.3-2.1-.7-4.1-1.2-6.1"
                      className="chin"
                    ></path>
                    <path
                      fill="#DDF1FA"
                      d="M134.5 46v35.5c0 21.815-15.446 39.5-34.5 39.5s-34.5-17.685-34.5-39.5V46"
                      className="face"
                    ></path>
                    <path
                      fill="#FFF"
                      stroke="#3A5E77"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M81.457 27.929c1.755-4.084 5.51-8.262 11.253-11.77.979 2.565 1.883 5.14 2.712 7.723 3.162-4.265 8.626-8.27 16.272-11.235a150.43 150.43 0 01-2.554 9.837c4.857-2.116 11.049-3.64 18.428-4.156a119.288 119.288 0 01-7.852 9.474"
                      className="hair"
                    ></path>
                    <g fill="#FFF" className="eyebrow">
                      <path d="M138.142 55.064a98.573 98.573 0 01-14.787 2.599 164.847 164.847 0 01-1.322 10.037 96.303 96.303 0 01-12.996-5.226 146.87 146.87 0 01-3.267 9.179 97.781 97.781 0 01-15.097-10.329 127.781 127.781 0 01-5.816 8.515c-7.916-4.124-15.053-9.114-21.296-14.738l1.107-11.768h73.475v11.731z"></path>
                      <path
                        stroke="#3A5E77"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M63.56 55.102c6.243 5.624 13.38 10.614 21.296 14.738a127.781 127.781 0 005.816-8.515 97.593 97.593 0 0015.097 10.329 147.099 147.099 0 003.267-9.179 96.303 96.303 0 0012.996 5.226 165.64 165.64 0 001.322-10.037 98.573 98.573 0 0014.787-2.599"
                      ></path>
                    </g>
                    <g className="eyeL">
                      <circle cx="85.5" cy="78.5" r="3.5" fill="#3a5e77"></circle>
                      <circle cx="84" cy="76" r="1" fill="#fff"></circle>
                    </g>
                    <g className="eyeR">
                      <circle
                        cx="114.5"
                        cy="78.5"
                        r="3.5"
                        fill="#3a5e77"
                      ></circle>
                      <circle cx="113" cy="76" r="1" fill="#fff"></circle>
                    </g>
                    <g className="mouth">
                      <path
                        fill="#617E92"
                        d="M100.2 101h-1.8c-2.7-.3-5.3-1.1-8-2.5-.7-.3-.9-1.2-.6-1.8.2-.5.7-.7 1.2-.7.2 0 .5.1.6.2 3 1.5 5.8 2.3 8.6 2.3s5.7-.7 8.6-2.3c.2-.1.4-.2.6-.2.5 0 1 .3 1.2.7.4.7.1 1.5-.6 1.9a22 22 0 01-7.9 2.5c-.4-.1-1.6-.1-1.9-.1z"
                        className="mouthBG"
                      ></path>
                      <path
                        fill="#617E92"
                        d="M100.2 101h-1.8c-2.7-.3-5.3-1.1-8-2.5-.7-.3-.9-1.2-.6-1.8.2-.5.7-.7 1.2-.7.2 0 .5.1.6.2 3 1.5 5.8 2.3 8.6 2.3s5.7-.7 8.6-2.3c.2-.1.4-.2.6-.2.5 0 1 .3 1.2.7.4.7.1 1.5-.6 1.9a22 22 0 01-7.9 2.5c-.4-.1-1.6-.1-1.9-.1z"
                        className="mouthSmallBG"
                        display="none"
                      ></path>
                      <path
                        d="M95 104.2c-4.5 0-8.2-3.7-8.2-8.2v-2c0-1.2 1-2.2 2.2-2.2h22c1.2 0 2.2 1 2.2 2.2v2c0 4.5-3.7 8.2-8.2 8.2H95z"
                        className="mouthMediumBG"
                        display="none"
                      ></path>
                      <path
                        fill="#617e92"
                        stroke="#3a5e77"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M100 110.2c-9 0-16.2-7.3-16.2-16.2 0-2.3 1.9-4.2 4.2-4.2h24c2.3 0 4.2 1.9 4.2 4.2 0 9-7.2 16.2-16.2 16.2z"
                        className="mouthLargeBG"
                        display="none"
                      ></path>
                      <defs>
                        <path
                          id="mouthMaskPath"
                          d="M100.2 101h-1.8c-2.7-.3-5.3-1.1-8-2.5-.7-.3-.9-1.2-.6-1.8.2-.5.7-.7 1.2-.7.2 0 .5.1.6.2 3 1.5 5.8 2.3 8.6 2.3s5.7-.7 8.6-2.3c.2-.1.4-.2.6-.2.5 0 1 .3 1.2.7.4.7.1 1.5-.6 1.9a22 22 0 01-7.9 2.5c-.4-.1-1.6-.1-1.9-.1z"
                        ></path>
                      </defs>
                      <clipPath id="mouthMask">
                        <use overflow="visible" xlinkHref="#mouthMaskPath"></use>
                      </clipPath>
                      <g className="tongue" clipPath="url(#mouthMask)">
                        <circle cx="100" cy="107" r="8" fill="#cc4a6c"></circle>
                        <ellipse
                          cx="100"
                          cy="100.5"
                          fill="#fff"
                          className="tongueHighlight"
                          opacity="0.1"
                          rx="3"
                          ry="1.5"
                        ></ellipse>
                      </g>
                      <path
                        fill="#FFF"
                        d="M106 97h-4c-1.1 0-2-.9-2-2v-2h8v2c0 1.1-.9 2-2 2z"
                        className="tooth"
                        clipPath="url(#mouthMask)"
                      ></path>
                      <path
                        fill="none"
                        stroke="#3A5E77"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M100.2 101h-1.8c-2.7-.3-5.3-1.1-8-2.5-.7-.3-.9-1.2-.6-1.8.2-.5.7-.7 1.2-.7.2 0 .5.1.6.2 3 1.5 5.8 2.3 8.6 2.3s5.7-.7 8.6-2.3c.2-.1.4-.2.6-.2.5 0 1 .3 1.2.7.4.7.1 1.5-.6 1.9a22 22 0 01-7.9 2.5c-.4-.1-1.6-.1-1.9-.1z"
                        className="mouthOutline"
                      ></path>
                    </g>
                    <path
                      fill="#3a5e77"
                      d="M97.7 79.9h4.7c1.9 0 3 2.2 1.9 3.7l-2.3 3.3c-.9 1.3-2.9 1.3-3.8 0l-2.3-3.3c-1.3-1.6-.2-3.7 1.8-3.7z"
                      className="nose"
                    ></path>
                    <g className="arms" clipPath="url(#armMask)">
                      {animatedArms}
                      {/* <Arm1 />
            <Arm2 /> */}
                    </g>
                  </svg>
                )}
              </div>
            </div>
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input
                style={inputStyle}
                type="text"
                name="username"
                placeholder="Enter Username"
                value={username}
                onChange={handleUsernameChange}
                onFocus={changeToUsernameImage}
                onBlur={changeToDefault}
                autocomplete="off"
              />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                style={inputStyle}
                type="password"
                name="password"
                value={password}
                placeholder="Enter Password"
                onChange={handlePasswordChange}
                onFocus={changeToPasswordImage}
                onBlur={changeToDefault}
              />
            </Form.Item>
            <Button
              style={{
                backgroundColor: 'black',
                color: 'white',
                marginLeft: 55,
                width: 180,
                height: 40

              }}
              onClick={form.submit}
              loading={loading}
            >
              Login
            </Button>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                marginTop: "24px",
                fontSize: "14px",
                color: "#666"
              }}
            >
              <Link
                to="/register"
                style={{
                  color: "#000",
                  textDecoration: "underline",
                  textDecorationThickness: "1px",
                  textUnderlineOffset: "2px",
                  transition: "text-decoration-color 0.2s ease",
                }}
                onMouseEnter={e => {
                  e.target.style.textDecorationColor = "#666";
                }}
                onMouseLeave={e => {
                  e.target.style.textDecorationColor = "#000";
                }}
              >
                Register
              </Link>
              <span>or</span>
              <Link
                to="/forgot-password"
                style={{
                  color: "#000",
                  textDecoration: "underline",
                  textDecorationThickness: "1px",
                  textUnderlineOffset: "2px",
                  transition: "text-decoration-color 0.2s ease",
                }}
                onMouseEnter={e => {
                  e.target.style.textDecorationColor = "#666";
                }}
                onMouseLeave={e => {
                  e.target.style.textDecorationColor = "#000";
                }}
              >
                Forgot Password
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginAnimation;




