import React from "react";
import CustomButton from "./button.component";

export default function Modal(props) {
  const close = props.closeModal != null ? props.closeModal : () => {};
  return (
    <div className="w-full h-full fixed top-0 left-0  bg-opacity-30 bg-black">
      <div className="w-full h-full p-3 shadowAround relative m-auto z-index-50 flex flex-row justify-center items-center">
        <div className="w-2/5 h-auto shadow-shadowAroundY bg-yellow-50 bg p-4 rounded-2xl">
          <h3 className="py-2 m-auto font-nunito text-3xl font-bold text-center uppercase">
            {props.title}
          </h3>
          <p className="py-2 m-auto text-center font-nunito">{props.message}</p>
          <div className="text-center py-2">
            <CustomButton
              text="Close"
              fontSize="1rem"
              execFunc={() => close()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
