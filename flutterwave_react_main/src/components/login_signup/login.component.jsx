import React, { useContext, useState } from "react";
import login from "../../assets/images/login.svg";
import CustomButton from "../global_components/button.component";
import axios from "axios";
import UserContext from "../../context/user.context";
import Modal from "../global_components/modal.component";
import { useHistory } from "react-router-dom";
import { apiUrl } from "../../configParams";

export default function LoginComponent(props) {
  const history = useHistory();
  const [loginDetails, setLoginDetails] = useState({});
  const [state, dispatch] = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });

  const closeModal = () => {
    setShowModal(false);
  };

  const formIsFilled = () => {
    const values = Object.keys(loginDetails);
    return !(values.length < 2);
  };

  const submitLoginForm = async (signUpDetails) => {
    try {
      const response = await axios({
        method: "post",
        url: apiUrl + "users/login",
        data: loginDetails,
      });
      if (response.data.status !== "success") {
        setShowModal(true);
        setModalContent({
          ...modalContent,
          title: "failed",
          message: response.data.message,
        });
      } else {
        dispatch({ type: "LOGIN", payload: response.data });
        let link = "";
        if (response.data.data.accountType === "dispatch_rider") {
          link = "dispatch"
        } else if (response.data.data.accountType === "admin") {
          link = "admin"
        }
        else if (response.data.data.accountType === "merchant") {
          link = "merchant"
        }
        history.replace(`/${link}`);
      }
    } catch (err) {
      // return null;
    }
  };

  return (
    <div className="w-full grid grid-cols-2 items-center justify-center px-10 my-5">
      {showModal && (
        <Modal
          closeModal={() => {
            closeModal();
          }}
          message={modalContent.message}
          title={modalContent.title}
        />
      )}
      <div className="p-24">
        <img src={login} alt="shop" className="no-repeat w-full h-auto cover" />
      </div>
      <div className="w-full h-auto shadow-aroundY rounded-5xl bg-yellow-50 p-5 my-auto mx-auto">
        <h2 className="text-4xl font-nunito font-bold text-gray-800 pb-4 mx-auto text-center mt-10">
          Login
        </h2>
        <div className="h-full p-7 w-4/5 mx-auto">
          <div>
            <p className="font-nunito font-bold py-0">Enter your username:</p>
            <input
              onChange={(e) => {
                setLoginDetails({ ...loginDetails, username: e.target.value });
              }}
              required
              name="username"
              type="text"
              className="outline-none bg-transparent border-b-2 border-gray-600 mb-7 rounded-sm font-nunito font-lg h-8 text-decoration-none w-full"
            />
          </div>
          <div>
            <p className="font-nunito font-bold py-0">Enter your password:</p>
            <input
              onChange={(e) => {
                setLoginDetails({ ...loginDetails, password: e.target.value });
              }}
              required
              name="password"
              type="password"
              className="outline-none bg-transparent border-b-2 border-gray-600 mb-3 rounded-sm font-nunito font-lg h-8 text-decoration-none w-full"
            />
          </div>
          <div className="text-center py-6">
            <CustomButton
              text="Log In"
              execFunc={() => {
                if (formIsFilled()) {
                  submitLoginForm(loginDetails);
                } else {
                  setShowModal(true);
                  setModalContent({
                    title: "Login Failed",
                    message: "All fields are required",
                  });
                }
              }}
              fontSize={"1.4rem"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
