import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Kéo lên đầu trang mỗi khi location thay đổi
  }, [location]);

  return null;
};

export default ScrollToTop;
