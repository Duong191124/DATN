import { fetchDataColor, fetchDataProductAPI, fetchDataSize } from '../../../../../service/api.service';
import './product.detail.page.css';
import React, { useEffect, useState } from 'react';

const ProductDetailPage = () => {
    const [product, setProduct] = useState([])
    const [size, setSize] = useState([])
    const [color, setColor] = useState([])

    // const product = {
    //     name: "Jack & Jones Men's T-Shirt",
    //     description: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Excepturi illo possimus quae tenetur.",
    //     price: 39.99,
    //     originalPrice: 59.99,
    //     imageUrl: "https://via.placeholder.com/300",
    //     sizes: ["XXL", "XL", "L"],
    //     colors: ["Blue", "White", "Green"], // Example colors
    // };
    const initProduct = async () => {
        const res = await fetchDataProductAPI();
        setProduct(res.data.data)

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