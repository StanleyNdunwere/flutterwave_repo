import React from "react";

export default function MerchantList(props) {
  let merchants = props.merchants;

  return (
    <div className="rounded-2xl border-yellow-500 border-2 py-4 px-4 w-full">
      <p className="text-3xl font-nunito font-bold">{"Your Merchants"}</p>
      <div className="flex flex-row items-center mb-3">
        {props.userType === "merchant" ? (
          <p className="py-2 ml-3  font-bold font-nunito bg-green-600 shadow-around text-yellow-50 px-4 rounded-2xl text-sm">
            Merchant
          </p>
        ) : (
          <span></span>
        )}
      </div>

      {merchants.map((merchant) => {
        return (
          <div key={merchant.username}>
            <div>
              <p className="font-nunito font-extrabold text-yellow-600 py-4">
                Username:
                <span className="text-gray-800"> {merchant.username}</span>
              </p>
            </div>
            <div>
              <p className="font-nunito font-extrabold text-yellow-600 pb-4">
                Account No:
                <span className="text-gray-800">
                  {" "}
                  {merchant.accountNumber}{" "}
                </span>
              </p>
            </div>
            <div>
              <p className="font-nunito font-extrabold text-yellow-600 pb-4">
                Bank Name:
                <span className="text-gray-800"> {merchant.bankName} </span>
              </p>
            </div>
            <div>
              <p className="font-nunito font-extrabold text-yellow-600 pb-4">
                SubAccountId:
                <span className="text-gray-800"> {merchant.subAccountId} </span>
              </p>
            </div>
            <div className="overflow-hidden ">
              <p className="font-nunito font-extrabold text-yellow-600 pb-4">
                Key:
                <span className="text-gray-800  font-extrabold text-md">
                  {" "}
                  {merchant.subAccountIdKey}
                </span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
