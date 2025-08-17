import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, removeFromCart, navigate, clearCart } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (!cartItems || typeof cartItems !== 'object' || products.length === 0) {
      setCartData([]);
      return;
    }

    const validProductIds = new Set(products.map(({ _id }) => _id));

    const temp = Object.entries(cartItems)
      .filter(([key, qty]) => {
        const [id] = key.split('_');
        return qty > 0 && validProductIds.has(id);
      })
      .map(([key, qty]) => {
        const [id, size] = key.split('_');
        return { key, _id: id, size, quantity: qty };
      });

    setCartData(temp);
  }, [cartItems, products]);

  const findProduct = (id) => products.find((p) => p._id === id);

  const getProductImage = (product) => {
    if (!product) return assets.logo;
    if (Array.isArray(product.image) && product.image.length) return product.image[0];
    if (typeof product.image === 'string') return product.image;
    return assets.logo;
  };

  if (cartData.length === 0) {
    return (
      <div className="empty-cart" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Your cart is empty.</p>
        <button onClick={() => navigate('/')} style={{ padding: '0.75rem 1.5rem', background: '#333', color: '#fff', border: 'none', borderRadius: '4px' }}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page" style={{ maxWidth: '700px', margin: '2rem auto', padding: '1rem' }}>
      <Title title={`Your Cart (${cartData.length} ${cartData.length === 1 ? 'item' : 'items'})`} />
      <button
        onClick={() => clearCart()}
        style={{
          margin: '1rem 0',
          padding: '0.75rem 1.5rem',
          background: 'orange',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Clear Cart
      </button>
      <div className="cart-items">
        {cartData.map(({ key, _id, size, quantity }) => {
          const product = findProduct(_id);
          if (!product) return null;

          return (
            <div key={key} style={{ display: 'flex', marginBottom: '1.5rem', border: '1px solid #ccc', borderRadius: '6px', padding: '1rem', background: '#fff' }}>
              <img
                src={getProductImage(product)}
                alt={product.name}
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'contain',
                  borderRadius: '6px',
                  marginRight: '1rem',
                  background: '#fafafa'
                }}
                onError={e => { e.target.src = assets.logo; }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 0.5rem' }}>{product.name}</h3>
                <p><strong>Size:</strong> {size}</p>
                <p><strong>Price:</strong> {currency}{product.price}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', marginBottom: '1rem' }}>
                  <button
                    onClick={() => {
                      if (quantity > 1) updateQuantity(_id, size, quantity - 1);
                      else removeFromCart(_id, size);
                    }}
                    style={{
                      backgroundColor: '#ff6b35',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: quantity > 1 ? 'pointer' : 'not-allowed',
                      padding: '0.3rem 0.6rem'
                    }}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={e => {
                      const val = Math.max(1, Number(e.target.value));
                      updateQuantity(_id, size, val);
                    }}
                    style={{
                      width: '50px',
                      textAlign: 'center',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      padding: '0.3rem'
                    }}
                  />
                  <button
                    onClick={() => updateQuantity(_id, size, quantity + 1)}
                    style={{
                      backgroundColor: '#4caf50',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      padding: '0.3rem 0.6rem'
                    }}
                  >
                    +
                  </button>
                </div>
                <p><strong>Subtotal:</strong> {currency}{(product.price * quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(_id, size)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <CartTotal />
    </div>
  );
};

export default Cart;
