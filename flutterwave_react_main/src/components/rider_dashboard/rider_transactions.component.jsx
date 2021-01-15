import React from "react";

export default function Transaction(props) {
  return (
    <div className="h-18 py-2 px-6 my-5 shadow-lg rounded-2xl overflow-none w-full bg-yellow-100 flex flex-row justify-between items-center">
      <img
        src="https://source.unsplash.com/random/800x800"
        className="rounded-full h-14"
        alt="product"
      />
      <p>product name</p>
      <p>NGN 300.00</p>
      <p>NGN 290.00</p>
    </div>
  );
}
