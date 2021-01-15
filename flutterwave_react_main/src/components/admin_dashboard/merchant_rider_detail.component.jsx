import React from 'react'

export default function MerchantRiderDetail(props) {
  return (
    <div className='h-54 py-4 px-6 bg-green-800 text-yellow-400 shadow-lg rounded-3xl'>
      <div className="w-full flex flex-row items-center">
        <h3 className='text-2xl font-nunito font-bold mr-12'>Username: Merchant</h3>
        <h3 className='text-2xl font-nunito font-bold'>Role: Merchant</h3>
      </div>
      <div className="w-full h-14 py-4 flex flex-row justify-between items-center text-yellow-50">
        <p className='font-nunito font-extrabold text-lg text-yellow-50'>Earned: <span>NGN 100.00</span></p>
        <p className='font-nunito font-extrabold text-lg text-yellow-50'>Volume Sold: <span>500</span></p>
        <p className='font-nunito font-extrabold text-lg text-yellow-50'>Commissions Paid: <span>NGN 100000.00</span></p>
      </div>
    </div>
  )
}