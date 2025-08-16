import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {
<<<<<<< HEAD
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    // Transform flat _id_size keys into array for rendering
    const tempData = Object.keys(cartItems).map((key) => {
      const [productId, size] = key.split('_');
      return {
        _id: productId,
        size,
        quantity: cartItems[key],
        key, // keep the full key for update/remove
      };
    }).filter(item => item.quantity > 0);
    setCartData(tempData);
  }, [cartItems]);

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div>
        {cartData.map((item) => {
          const productData = products.find((p) => p._id === item._id);
          if (!productData) return null; // skip deleted products

          return (
            <div key={item.key} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
              <div className='flex items-start gap-6'>
                <img className='w-16 sm:w-20' src={productData.image[0]} alt="" />
                <div>
                  <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                  <div className='flex items-center gap-5 mt-2'>
                    <p>{currency}{productData.price}</p>
                    <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                  </div>
                </div>
              </div>
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val > 0) updateQuantity(item._id, item.size, val);
                }}
                className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1'
              />
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className='w-4 mr-4 sm:w-5 cursor-pointer'
                src={assets.bin_icon}
                alt="Remove"
              />
=======
  const { 
    products, 
    currency, 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    navigate, 
    clearCart 
  } = useContext(ShopContext);

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
        <button 
          onClick={() => navigate('/')} 
          style={{ 
            padding: '0.75rem 1.5rem', 
            background: '#333', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '4px' 
          }}
        >
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
            <div 
              key={key} 
              style={{ 
                display: 'flex', 
                marginBottom: '1.5rem', 
                border: '1px solid #ccc', 
                borderRadius: '6px', 
                padding: '1rem', 
                background: '#fff' 
              }}
            >
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
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{product.name}</h3>
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
>>>>>>> 93a1078 (changed some cart and other options)
            </div>
          );
        })}
      </div>

<<<<<<< HEAD
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className='w-full text-end'>
            <button
              onClick={() => navigate('/place-order')}
              className='bg-black text-white text-sm my-8 px-8 py-3'
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
=======
      <CartTotal />
>>>>>>> 93a1078 (changed some cart and other options)
    </div>
  );
};

export default Cart;
