import React from "react";

export default function AdminTransaction(props) {

  return (
    <div className="h-18 py-2 px-3 my-5 shadow-lg rounded-2xl overflow-none w-full bg-yellow-100 flex flex-row justify-between items-center">
      <img src={props.imageLink} className="rounded-full h-14" alt="product" />
      <p>{props.name}</p>
      <p>{props.merchantName}</p>
      <p>{props.dispatchName}</p>
      <p>{props.currency}</p>
      <p>{props.merchantCut}</p>
      <p>{props.dispatchCut}</p>
      <p>{parseFloat(props.jumgaProductCut) + parseFloat(props.jumgaDeliveryCut)}</p>
    </div>
  );
}
