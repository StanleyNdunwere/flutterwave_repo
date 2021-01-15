import React from "react";

export default function CustomButton(props) {
  let execute = null;
  if (props.execFunc == null) {
    execute = () => {};
  } else {
    execute = props.execFunc;
  }
  return (
    <div
      style={{
        fontSize: props.fontSize,
      }}
    >
      <span
        onClick={() => execute()}
        className="font-nunito font-bold text-md px-4 py-2 bg-yellow-500 cursor-pointer rounded-xl shadow-around text-yellow-50 hover:bg-yellow-600"
      >
        {props.text}
      </span>
    </div>
  );
}
