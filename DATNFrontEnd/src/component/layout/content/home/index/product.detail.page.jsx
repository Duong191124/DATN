import { useParams } from 'react-router-dom';
import { fetchDataColor, fetchDataProductAPI, fetchDataProductById, fetchDataSize } from '../../../../../service/api.service';
import './product.detail.page.css';
import React, { useEffect, useState } from 'react';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState([])
    const [size, setSize] = useState([])
    const [color, setColor] = useState([])

    const initProduct = async () => {
        const res = await fetchDataProductById(id);
        setProduct(res.data.data)
        console.log("check res", res)
    }


    const initSize = async () => {
        const res = await fetchDataSize();
        setSize(res.data.data)

    }

    const initColor = async () => {
        const res = await fetchDataColor();
        setColor(res.data.data)
    }
    useEffect(() => {
        initProduct();
        initSize();
        initColor();
    }, [])



    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    // console.log("Check product", product)
    return (
        <div className="product-detail">
            <div className="product-info">
                <img src={product.image} alt={product.name} />
                <div className="product-details">
                    <h1>{product.name}</h1>
                    <p className="price">
                        <span className="current-price">${product.price}</span>

                    </p>
                    <p>{product.description}</p>

                    <div className="select-size">
                        <label>Size:</label>
                        <div className="size-options">
                            {size.map((size) => (
                                <button
                                    key={size.id}
                                    className={`size-button ${selectedSize === size.name ? 'selected' : ''}`}
                                    onClick={() => setSelectedSize(size.name)}
                                >
                                    {size.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="select-color">
                        <label>Color:</label>
                        <div className="color-options">
                            {color.map((color) => (
                                <button
                                    key={color.id}
                                    className={`color-button ${selectedColor === color.name ? 'selected' : ''}`}
                                    onClick={() => setSelectedColor(color.name)}
                                >
                                    {color.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="quantity">
                        <button className="quantity-btn" onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>-</button>
                        <input type="text" value={quantity} readOnly /><button className="quantity-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>

                    <button className="add-to-cart">Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;