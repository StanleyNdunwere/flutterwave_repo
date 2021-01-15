import React, { useContext, useState } from "react";
import UserContext from "../../context/user.context";
import CustomButton from "./button.component";

export default function UserHeader(props) {
  const [state, dispatch] = useContext(UserContext);
  const [selectedRider, setSelectedRider] = useState();
  const username = state.username == null ? "Guest" : state.username;

  return (
    <>
      <h3 className="font-nunito text-4xl font-bold py-1">
        Hello{" " + username},
      </h3>
      <div className="flex flex-row  items-center">
        {props.userType === "merchant" && (
          <>
            <span className="font-bold font-nunito text-xl mr-4">
              Choose Your Rider:
            </span>
            <select
              onChange={(e) => {
                setSelectedRider(e.target.value);
              }}
              name="riderId"
              id="riderId"
              className="py-2 px-5 mr-5 outline-none border-yellow-700 border-2 rounded-xl"
            >
              <option value=""></option>
              {props.riders.map((rider) => {
                return (
                  <option key={rider._id} value={rider._id}>
                    {rider.username}
                  </option>
                );
              })}
            </select>
            <CustomButton
              text="Add Rider"
              fontSize={"1rem"}
              execFunc={() => {
                if (props.addMerchantToRider != null)
                  props.addMerchantToRider(props.merchantId, selectedRider);
              }}
            />
          </>
        )}
      </div>
    </>
  );
}
