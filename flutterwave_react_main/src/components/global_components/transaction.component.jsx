import React from "react";

export default function Transaction(props) {

  return (
    <div className="h-18 py-2 px-6 my-5 shadow-lg rounded-2xl overflow-none w-full bg-yellow-100 flex flex-row justify-between items-center">
      <img
        src={props.imageLink}
        className="rounded-full h-14"
        alt="product"
      />
      <p>{props.name}</p>
      <p>{props.currency}</p>
      <p>{props.price}</p>
      <p>{props.quantity}</p>
      <p>{props.cut}</p>
    </div>
  );
}
