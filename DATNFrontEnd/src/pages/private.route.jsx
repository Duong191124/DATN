import { Button, Result } from "antd";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../component/context/auth.context";

const PrivateRoute = (props) => {
    const { user } = useContext(AuthContext);

    if (user && user.id) {
        const isAdmin = user.email.endsWith('@admin.com');
        const isStaff = user.email.endsWith('@staff.com');
        const isCustomer = !isAdmin && !isStaff;

        if (props.allowedFor === 'admin' && isAdmin) {
            return <>{props.children}</>;
        } else if (props.allowedFor === 'staff' && isStaff) {
            return <>{props.children}</>;
        } else if (props.allowedFor === 'customer' && isCustomer) {
            return <>{props.children}</>;
        } else {
            return (
                <Result
                    status="403"
                    title="Forbidden!"
                    subTitle="You do not have permission to access this page."
                    extra={<Button type="primary">
                        <Link to="/">
                            <span>Back to homepage</span>
                        </Link>
                    </Button>}
                />
            );
        }
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