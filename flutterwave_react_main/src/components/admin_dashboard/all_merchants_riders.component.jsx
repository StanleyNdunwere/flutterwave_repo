import React from "react";

export default function MerchantRiderList(props) {
  return (
    <>
      <h2 className="text-3xl font-nunito font-bold px-3">{props.title}</h2>
      <div className="my-3 w-full h-auto max-h-72 overflow-y-scroll">
        {props.users.length === 0 ? (
          <div>
            <h2 className="text-center font-nunito font-extrabold text-2xl py-4 px-2">
              No registered {props.userType} yet
            </h2>
          </div>
        ) : (
          props.users.map((user) => {
            return (
              <div
                key={user._id}
                className="flex flex-row justify-around items-center p-1 border-1 border-yellow-500 my-2 rounded-2xl"
              >
                <p className="font-nunito font-bold">{user.username}</p>
                <p
                  onClick={() => {
                    // props.delete(user._id, user.accountType);
                  }}
                  className="py-1 ml-3  font-bold font-nunito bg-green-600 shadow-lg cursor-pointer text-yellow-50 px-4 rounded-2xl text-sm"
                >
                  view
                </p>
                <p
                  onClick={() => {
                    props.delete(user._id, user.accountType);
                  }}
                  className="py-1 ml-3  font-bold font-nunito bg-red-600 shadow-lg cursor-pointer text-yellow-50 px-4 rounded-2xl text-sm"
                >
                  Delete
                </p>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
