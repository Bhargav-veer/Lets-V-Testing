import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext)

  return (
    <Link
      onClick={() => scrollTo(0, 0)}
      className='block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer'
      to={`/product/${id}`}
    >
      {/* Product Image */}
      <div className='overflow-hidden'>
        <img
          className='w-full object-contain hover:scale-105 transition-transform duration-300 ease-in-out'
          src={image[0]}
          alt={name}
        />
      </div>

      {/* Product Details */}
      <div className='p-4'>
        <p className='text-gray-800 font-semibold text-sm sm:text-base truncate'>{name}</p>
        <p className='text-gray-600 text-sm sm:text-base font-medium mt-2'>
          {currency}
          {price}
        </p>
      </div>
    </Link>
  )
}

export default ProductItem