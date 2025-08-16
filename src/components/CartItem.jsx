import React from 'react';

const CartItem = ({ item }) => {
    // Use the Cloudinary URL directly if available
    const imageUrl = item.image
      ? item.image // Cloudinary URL
      : '/default-avatar.png'; // fallback if image missing

    return (
        <div className="cart-item">
            <img src={imageUrl} alt={item.name} />
            <div className="item-details">
                <h2>{item.name}</h2>
                <p>Price: ${item.price}</p>
                <p>Quantity: {item.quantity}</p>
            </div>
        </div>
    );
};

export default CartItem;