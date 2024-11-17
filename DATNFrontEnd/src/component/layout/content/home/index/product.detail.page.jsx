// import { useParams } from 'react-router-dom';
// import { fetchDataColor, fetchDataProductById, fetchDataSize, findByProductId } from '../../../../../service/api.service';
// import React, { useEffect, useState } from 'react';
// import { useCart } from '../../../../context/cart.context';

// const ProductDetailPage = () => {
//     const { id } = useParams();
//     const { addToCart } = useCart();
//     const [product, setProduct] = useState([]);
//     const [size, setSize] = useState([]);
//     const [color, setColor] = useState([]);

//     const [selectedSize, setSelectedSize] = useState('');
//     const [selectedColor, setSelectedColor] = useState('');
//     const [quantity, setQuantity] = useState(1);

//     // Fetch data cho size và color
//     const initSize = async () => {
//         const res = await fetchDataSize();
//         setSize(res.data.data);
//     };

//     const initColor = async () => {
//         const res = await fetchDataColor();
//         setColor(res.data.data);
//     };

//     // Fetch data cho product khi selectedColor thay đổi
//     useEffect(() => {
//         const initProduct = async () => {
//             const res = await findByProductId(id);
//             const productDetails = res.data.data.details;

//             // Lọc chi tiết sản phẩm theo màu được chọn
//             const selectedProduct = productDetails.find(detail => detail.color.name === selectedColor) || productDetails[0];
//             setProduct(selectedProduct);
//         };

//         initProduct();
//     }, [id, selectedColor]);

//     useEffect(() => {
//         initSize();
//         initColor();
//     }, []);

//     const handleAddToCart = () => {
//         if (!selectedSize || !selectedColor) {
//             alert('Please select size and color');
//             return;
//         }

//         const cartItem = {
//             ...product,
//             size: selectedSize,
//             color: selectedColor,
//             quantity: quantity,
//         };

//         addToCart(cartItem);
//     };

//     return (
//         <div className="product-detail">
//             <div className="product-info">
//                 <img src={product.image} alt={product.productResponse?.name} />
//                 <div className="product-details">
//                     <h1>{product.productResponse?.name}</h1>
//                     <p className="price">
//                         <span className="current-price">{product.defaultPrice}</span>
//                         {product.discountPrice && <span className="discount-price">{product.discountPrice}</span>}
//                     </p>
//                     <p>{product.productResponse?.description}</p>

//                     <div className="select-size">
//                         <label>Size:</label>
//                         <div className="size-options">
//                             {size
//                                 .filter(size => size.status === 1)
//                                 .map(size => (
//                                     <button
//                                         key={size.id}
//                                         className={`size-button ${selectedSize === size.code ? 'selected' : ''}`}
//                                         onClick={() => setSelectedSize(size.code)}
//                                     >
//                                         {size.code}
//                                     </button>
//                                 ))}
//                         </div>
//                     </div>

//                     <div className="select-color">
//                         <label>Color:</label>
//                         <div className="color-options">
//                             {color
//                                 .filter(color => color.status === 1)
//                                 .map(color => (
//                                     <button
//                                         key={color.id}
//                                         className={`color-button ${selectedColor === color.name ? 'selected' : ''}`}
//                                         onClick={() => setSelectedColor(color.name)}
//                                     >
//                                         {color.name}
//                                     </button>
//                                 ))}
//                         </div>
//                     </div>

//                     <div className="quantity">
//                         <button className="quantity-btn" onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>-</button>
//                         <input type="text" value={quantity} readOnly />
//                         <button className="quantity-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
//                     </div>

//                     <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProductDetailPage;
