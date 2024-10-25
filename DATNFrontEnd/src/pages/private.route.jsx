import { Button, Result } from "antd";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../component/context/auth.context";

const PrivateRoute = (props) => {
    const { setUser, loginStatus } = useContext(AuthContext);

    if (user && user.id || loginStatus === 201) {
        return (
            <>
                {props.children}
            </>)
    }


    // If staff or admin is not logged in
    return (
        <Result
            status="403"
            title="Unauthorize!"
            subTitle="Bạn cần đăng nhập để truy cập nguồn tài nguyên này."
            extra={<Button type="primary">
                <Link to="/">
                    <span>Back to homepage</span>
                </Link>
            </Button>}
        />
    );
};


export default PrivateRoute