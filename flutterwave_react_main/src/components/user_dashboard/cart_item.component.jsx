import React, { useState } from "react";

export default function CartItem(props) {

  const [selected, setSelected] = useState(false);
  return (
    <div
      style={{
        background: selected ? "#fee0d1" : "#d1fed1",
      }}
      className="h-18 py-2 px-2 my-5 shadow-lg rounded-lg overflow-none w-full bg-green-100 flex flex-row justify-between items-center"
    >
      <img
        src={`${props.item.productImageLink}`}
        className="rounded-lg h-14"
        alt="product"
      />
      <p>{props.item.productName}</p>
      <p>{props.item.itemQuantity}</p>
      <p>{props.item.currencyCode}</p>
      <p>{props.item.price}</p>
      <p>{props.item.deliveryCost}</p>
      <div className="flex flex-row items-center">
        <p
          onClick={() => {
            props.delete(props.item._id);
          }}
          className="font-nunito font-extrabold mr-2 text-sm px-2 py-2 bg-red-500 cursor-pointer rounded-xl shadow-around text-green-50 hover:bg-green-600"
        >
          Delete
        </p>
        <p
          onClick={() => {
            if (selected === false) {
              setSelected(true);
              let purchaseInfo = { ...props.item };
              props.setSelectedCartItems([
                ...props.selectedCartItems,
                purchaseInfo,
              ]);
            } else {
              setSelected(false);
              const newSelected = props.selectedCartItems.filter((item) => {
                return item._id != props.item._id;
              });
              props.setSelectedCartItems([...newSelected]);
            }
          }}
          className="font-nunito font-extrabold mr-2 text-sm px-2 py-2 bg-blue-500 cursor-pointer rounded-xl shadow-around text-green-50 hover:bg-green-600"
        >
          {selected ? "Unselect" : "Select"}
        </p>
        <p
          onClick={() => {
            props.orderSingleItem({
              name: props.item.username,
              email: props.item.email,
              productId: props.item.productId,
              quantity: props.item.itemQuantity
            }, props.item._id)

          }}
          className="font-nunito mr-2 font-extrabold text-sm px-2 py-2 bg-yellow-500 cursor-pointer rounded-xl shadow-around text-yellow-50 hover:bg-green-600"
        >
          Buy Now
        </p>
      </div>
    </div>
  );
}
