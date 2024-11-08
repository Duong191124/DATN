
import React, { useState } from 'react';

const ProductDetailPage = () => {
    const product = {
        name: "Product Name",
        description: "This is a great product.",
        price: 99.99,
        imageUrl: "https://via.placeholder.com/300",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Red", "Blue", "Black"],
    };

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="product-detail">
            <div className="product-info">
                <img src={product.imageUrl} alt={product.name} />
                <div className="product-details">
                    <h1>{product.name}</h1>
                    <p>{product.description}</p>
                    <p><strong>Price:</strong> ${product.price}</p>

                    <div className="select-size">
                        <label htmlFor="size">Size</label>
                        <select
                            id="size"
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(e.target.value)}
                        >
                            <option value="">Select Size</option>
                            {product.sizes.map((size) => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>

                    <div className="select-color">
                        <label htmlFor="color">Color</label>
                        <select
                            id="color"
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                        >
                            <option value="">Select Color</option>
                            {product.colors.map((color) => (
                                <option key={color} value={color}>{color}</option>
                            ))}
                        </select>
                    </div>

                    <div className="quantity">
                        <label htmlFor="quantity">Quantity</label>
                        <input
                            type="number"
                            id="quantity"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, e.target.value))}
                        />
                    </div>

                    <button>Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;

