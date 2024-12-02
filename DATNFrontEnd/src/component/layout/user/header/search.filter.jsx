import React, { useEffect, useRef, useState } from "react";
import { Input, List, Typography, Avatar, message } from "antd";
import { useNavigate } from "react-router-dom";

const { Search } = Input;
const { Text } = Typography;

const ProductSearch = ({ data }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNoResults, setShowNoResults] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const navigate = useNavigate();
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentPlaceholder, setCurrentPlaceholder] =
    useState("Tìm kiếm sản phẩm");
  const isDeleting = useRef(false);
  const typingSpeed = 100; // Thời gian gõ mỗi ký tự
  const deletingSpeed = 50; // Thời gian xóa mỗi ký tự
  const pauseDuration = 1000; // Thời gian dừng khi hoàn thành mỗi chuỗi
  useEffect(() => {
    const typeEffect = () => {
      const targetText = currentPlaceholder;
      if (!isDeleting.current) {
        // Gõ ký tự
        if (currentTextIndex < targetText.length) {
          setPlaceholder((prev) => prev + targetText[currentTextIndex]);
          setCurrentTextIndex((prev) => prev + 1);
        } else {
          // Nếu đã gõ xong, dừng lại một chút rồi xóa
          setTimeout(() => {
            isDeleting.current = true;
            setCurrentTextIndex(targetText.length - 1); // Quay lại ký tự cuối cùng để xóa
          }, pauseDuration);
        }
      } else {
        // Xóa ký tự
        if (currentTextIndex > 0) {
          setPlaceholder((prev) => prev.slice(0, -1));
          setCurrentTextIndex((prev) => prev - 1);
        } else {
          // Khi đã xóa xong, đổi chuỗi và bắt đầu gõ lại
          isDeleting.current = false;
          setCurrentPlaceholder(
            currentPlaceholder === "Tìm kiếm sản phẩm"
              ? "Tìm kiếm theo thương hiệu"
              : "Tìm kiếm sản phẩm"
          );
        }
      }
    };
    const interval = setInterval(
      typeEffect,
      isDeleting.current ? deletingSpeed : typingSpeed
    );
    return () => clearInterval(interval);
  }, [currentTextIndex, currentPlaceholder]);

  const handleSearch = (value) => {
    setSearchTerm(value);

    if (value.trim() === "") {
      setSearchResults([]);
      setShowNoResults(false);
      return;
    }

    const filteredProducts = data.filter((product) =>
      [
        product.products.name,
        product.products.code,
        product.products.categoryName,
        product.products.brandName,
        product.minPrice.toString(),
        product.maxPrice.toString(),
        product.details.map((detail) => detail.name).join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(value.toLowerCase())
    );

    setSearchResults(filteredProducts);
    setShowNoResults(filteredProducts.length === 0);
  };

  const selectedProduct = (product) => {
    setSearchResults([]);
    setShowNoResults(false);
    navigate(`/product/${product.products.id}`);
  };

  const onSearchSubmit = (value) => {
    // Kiểm tra nếu ô tìm kiếm trống
    if (value.trim() === "") {
      message.warning("Please fill out this field"); // Hiển thị thông báo cảnh báo
      return;
    }
    setSearchTerm("");
    setSearchResults([]);
    setShowNoResults(false);
    navigate(`/product?search-results=${value}`);
  };

  return (
    <div style={{ position: "relative", maxWidth: "600px", margin: "0 auto" }}>
      {/* Thanh tìm kiếm */}
      <Search
        placeholder={placeholder}
        allowClear
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        onSearch={onSearchSubmit} // Gọi khi nhấn Enter hoặc nút tìm kiếm
        style={{
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      />
      {searchTerm && searchResults.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "48px",
            width: "500px",
            maxHeight: "300px",
            overflowY: "auto",
            background: "#fff",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            zIndex: 10,
          }}
        >
          <List
            itemLayout="horizontal"
            dataSource={searchResults}
            renderItem={(item) => (
              <List.Item
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #f0f0f0",
                  cursor: "pointer",
                  transition: "background 0.3s ease, transform 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f5f5f5";
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onClick={() => selectedProduct(item)}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.products.image} size={48} />}
                  title={
                    <Text strong>
                      {item.products.name} - {item.products.code}
                    </Text>
                  }
                  description={
                    <Text type="secondary">
                      Giá: ₫{item.minPrice} - ₫{item.maxPrice}
                    </Text>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      )}
      {searchTerm && showNoResults && (
        <div
          style={{
            position: "absolute",
            top: "48px",
            width: "100%",
            background: "#fff",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            padding: "16px",
            zIndex: 10,
          }}
        >
          <Text type="secondary">Không tìm thấy sản phẩm phù hợp.</Text>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
