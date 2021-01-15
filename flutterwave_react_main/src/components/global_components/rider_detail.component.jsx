import React from "react";

export default function RiderDetail(props) {

  return (
    <>
      {props.riderDetails ? <div className="rounded-2xl border-yellow-500 border-2 p-4 w-full">
        <div className="flex flex-row items-center mb-3">
          <p className="text-3xl font-nunito font-bold">
            {props.userType === "dispatch_rider" ? "Your Details" : "Your Rider"}
          </p>
          {props.userType === "dispatch_rider" ? (
            <p className="py-2 ml-3  font-bold font-nunito bg-green-600 shadow-around text-yellow-50 px-4 rounded-2xl text-sm">
              Dispatch Rider
            </p>
          ) : (
              <span></span>
            )}
        </div>
        <div>
          <p className="font-nunito font-extrabold text-yellow-600 py-4">
          Username: 
        <span className="text-gray-800"> {props.riderDetails.username}</span>
          </p>
        </div>
        <div>
          <p className="font-nunito font-extrabold text-yellow-600 pb-4">
            Account No:
        <span className="text-gray-800"> {props.riderDetails.accountNumber} </span>
          </p>
        </div>
        <div>
        <p className="font-nunito font-extrabold text-yellow-600 pb-4">
          Bank Name:
          <span className="text-gray-800"> {props.riderDetails.bankName} </span>
        </p>
      </div>
        <div>
          <p className="font-nunito font-extrabold text-yellow-600 pb-4">
            SubAccountId:
        <span className="text-gray-800"> {props.riderDetails.subAccountId}</span>
          </p>
        </div>
        <div className="overflow-hidden ">
          <p className="font-nunito font-extrabold text-yellow-600 pb-4">
            Key:{" "}
            <span className="text-gray-800"> {props.riderDetails.subAccountIdKey}</span>
          </p>
        </div>
      </div> :
        <div className="rounded-2xl border-yellow-500 border-2 font-bold font-nunito p-4 w-full h-40 flex flex-row text-center justify-center items-center">
          <h2>No rider attached to your account yet. Please choose rider</h2>
        </div>
      }
    </>
  );
}
