import { Button, Result } from "antd";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../component/context/auth.context";

const PrivateRoute = (props) => {
  const { user, loginStatus, role } = useContext(AuthContext);
  if (loginStatus === "200" && role === "customer") {
    return (
      <Result
        status="403"
        title="Unauthorize!"
        subTitle="Bạn không có quyền truy cập!."
        extra={
          <Button type="primary">
            <Link to="/">
              <span>Back to homepage</span>
            </Link>
          </Button>
        }
      />
    );
  }

  if ((user && user.id) || loginStatus === "201" || role !== "customer") {
    return <>{props.children}</>;
  }

  // If staff or admin is not logged in
  return (
    <Result
      status="403"
      title="Unauthorize!"
      subTitle="bạn không có quyền truy cập!."
      extra={
        <Button type="primary">
          <Link to="/">
            <span>Back to homepage</span>
          </Link>
        </Button>
      }
    />
  );
};

export default PrivateRoute;
