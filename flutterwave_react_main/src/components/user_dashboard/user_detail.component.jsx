import React from 'react'


export default function UserDetails(props) {

  return (
    <div className="rounded-2xl border-yellow-500 border-2 py-4 px-4 w-full">
      <div className="flex flex-row items-center mb-3">
        <p className="text-3xl font-nunito font-bold">
          {"Your Details"}
        </p>
        <p className="py-2 ml-3  font-bold font-nunito bg-green-600 shadow-around text-yellow-50 px-4 rounded-2xl text-sm">
          User
        </p>
      </div>
      <div>
        <p className="font-nunito font-extrabold text-yellow-600 py-4">
          Username:
          <span className="text-gray-800"> {props.userDetails.username}</span>
        </p>
      </div>
      <div>
        <p className="font-nunito font-extrabold text-yellow-600 pb-4">
          Account No:
          <span className="text-gray-800"> {props.userDetails.accountNumber} </span>
        </p>
      </div>
      <div>
        <p className="font-nunito font-extrabold text-yellow-600 pb-4">
          Bank Name:
          <span className="text-gray-800"> {props.userDetails.bankName} </span>
        </p>
      </div>
    </div>
  )


}