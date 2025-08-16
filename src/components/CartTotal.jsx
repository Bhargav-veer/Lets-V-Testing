import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
  const subtotal = getCartAmount();
  const total = subtotal + (subtotal === 0 ? 0 : delivery_fee);

  return (
<<<<<<< HEAD
    <div className='w-full'>
      <div className='text-2xl'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className='flex flex-col gap-2 mt-2 text-sm'>
        <div className='flex justify-between'>
          <p>Subtotal</p>
          <p>{currency}{subtotal}.00</p>
        </div>
        <hr />
        <div className='flex justify-between'>
          <p>Shipping Fee</p>
          <p>{currency}{subtotal === 0 ? 0 : delivery_fee}.00</p>
        </div>
        <hr />
        <div className='flex justify-between'>
          <b>Total</b>
          <b>{currency}{total}.00</b>
        </div>
=======
    <div className="cart-total" style={{ background: '#fafafa', padding: '1rem', borderRadius: '5px', marginTop: '2rem' }}>
      <Title title="Cart Summary" />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.7rem' }}>
        <span>Subtotal</span>
        <span>{currency}{subtotal}.00</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.7rem' }}>
        <span>Shipping Fee</span>
        <span>{currency}{subtotal === 0 ? 0 : delivery_fee}.00</span>
      </div>
      <hr />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1em' }}>
        <span>Total</span>
        <span>{currency}{total}.00</span>
>>>>>>> 93a1078 (changed some cart and other options)
      </div>
    </div>
  );
};

export default CartTotal;
