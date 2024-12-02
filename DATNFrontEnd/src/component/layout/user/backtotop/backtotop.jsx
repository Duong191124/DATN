import { ArrowUpOutlined, UpOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const checkScrollPosition = () => {
    if (window.scrollY > 500) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollPosition);
    return () => {
      window.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);

  const buttonStyle = {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    backgroundColor: "black",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "50%",
    fontSize: "20px",
    cursor: "pointer",
    display: isVisible ? "block" : "none",
    zIndex: 9999,
    transition: "opacity 0.3s ease-in, background-color 0.3s ease-in",
  };

  return (
    <button
      style={{
        ...buttonStyle,
      }}
      onClick={scrollToTop}
      aria-label="Lên đầu trang"
    >
      <UpOutlined />
    </button>
  );
};

export default BackToTop;
