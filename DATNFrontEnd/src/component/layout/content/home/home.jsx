import { Divider } from "antd";
import ProductCarousel from "../../../home/product.carousel";
import BrandCarousel from "../../../home/brand.carousel";
import HomeSlider from "../../../home/home.slider";
import ProductList from "../../../home/product.listing";

const Home = () => {
  return (
    <>
      <div style={{ height: 100 }}></div>
      {/* slider */}
      <HomeSlider />
      <Divider />

      {/* san pham hot */}
      <ProductCarousel />
      <Divider />

      {/* cac brand */}
      <BrandCarousel />
      <Divider />

      {/* product listing */}
      <ProductList />
      <Divider />
    </>
  );
};

export default Home;
