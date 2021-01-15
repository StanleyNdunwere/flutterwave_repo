import React, { useState } from "react";
import shop from "../../assets/images/shop.svg";
import CustomButton from "../global_components/button.component";
import axios from "axios";
import Modal from "../global_components/modal.component";
import { apiUrl } from "../../configParams";
import { useHistory } from "react-router-dom";

export default function SignUpComponent(props) {
  const history = useHistory();
  const [signUpDetails, setSignUpDetails] = useState({});
  const [allBanksByCode, setAllBanksByCode] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const closeModal = () => {
    setShowModal(false);
    setIsLoading(false);
  };

  const formIsFilled = () => {
    const values = Object.keys(signUpDetails);
    return !(values.length < 8);
  };

  const submitSignUpForm = async (signUpDetails) => {
    try {
      const response = await axios({
        method: "post",
        url: apiUrl + "users/sign-up",
        data: signUpDetails,
      });
      setShowModal(true);
      setModalContent({
        title: response.data.status,
        message: response.data.message,
      });
    } catch (err) {
      //handle error
    }
  };

  const fetchAllBanksByCode = (bankCode) => {
    const url = apiUrl + "country-currency/bank-codes/";
    axios.get(url + bankCode).then((res) => {
      const banks = res.data;
      if (banks.status === "success") {
        setAllBanksByCode([...banks.data.data]);
      } else {
        setAllBanksByCode([]);
      }
    });
  };

  return (
    <div className="w-full grid grid-cols-2 items-center justify-center px-10 mb-2">
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
        <img src={shop} alt="shop" className="no-repeat w-full h-auto cover" />
      </div>
      <div className="w-full h-full mt-2 shadow-aroundY rounded-4xl bg-yellow-50 p-4 mx-auto">
        <h2 className="text-4xl font-nunito font-extrabold text-gray-800 pb-4 mx-auto text-center">
          Sign Up
        </h2>
        <form className="w-full h-full flex flex-col ">
          {isLoading ? (
            <div className="w-full h-3/5 flex flex-row justify-center items-center">
              <h2 className="text-3xl font-nunito text-center font-extrabold">
                Loading...
              </h2>
            </div>
          ) : (
              <div className="flex flex-col justify-between h-full pb-7 w-4/5 mx-auto">
                <div>
                  <p className="font-nunito font-bold py-0">
                    Enter your username:
                </p>
                  <input
                    required
                    onChange={(e) => {
                      setSignUpDetails({
                        ...signUpDetails,
                        username: e.target.value,
                      });
                    }}
                    name="username"
                    type="text"
                    className="outline-none bg-transparent border-b-2 border-gray-600 mb-0 rounded-sm font-nunito h-8 text-decoration-none w-full"
                  />
                </div>
                <div>
                  <p className="font-nunito font-bold py-0">
                    Enter your password:
                </p>
                  <input
                    required
                    onChange={(e) => {
                      setSignUpDetails({
                        ...signUpDetails,
                        password: e.target.value,
                      });
                    }}
                    name="password"
                    type="password"
                    className="outline-none bg-transparent border-b-2 border-gray-600 mb-0 rounded-sm font-nunito h-8 text-decoration-none w-full"
                  />
                </div>
                <div>
                  <p className="font-nunito font-bold py-0 my-0">
                    Enter your Email:
                </p>
                  <input
                    required
                    onChange={(e) => {
                      setSignUpDetails({
                        ...signUpDetails,
                        accountEmail: e.target.value,
                      });
                    }}
                    name="email"
                    type="email"
                    className="outline-none bg-transparent border-b-2 border-gray-600 mb-0 rounded-sm font-nunito  h-8 text-decoration-none w-full"
                  />
                </div>
                <div>
                  <p className="font-nunito font-bold py-0 my-0">
                    Enter your Account Number:
                </p>
                  <input
                    required
                    onChange={(e) => {
                      setSignUpDetails({
                        ...signUpDetails,
                        accountNumber: e.target.value,
                      });
                    }}
                    name="accountNumber"
                    type="number"
                    className="outline-none bg-transparent border-b-2 border-gray-600 mb-0 rounded-sm font-nunito h-8 text-decoration-none w-full"
                  />
                </div>
                <div>
                  <p className="font-nunito font-bold py-0">
                    Choose Your Country:
                </p>
                  <select
                    required
                    onChange={(e) => {
                      setSignUpDetails({
                        ...signUpDetails,
                        country: e.target.value,
                      });
                      fetchAllBanksByCode(e.target.value);
                    }}
                    name="country"
                    id="country"
                    className="outline-none bg-transparent border-b-2 border-gray-600 mb-0 rounded-sm font-nunito h-8 text-decoration-none w-full"
                  >
                    <option value=""> </option>
                    <option value="NG">Nigeria</option>
                    <option value="GH">Ghana</option>
                    <option value="UK">UK</option>
                    <option value="KE">Kenya</option>
                  </select>
                </div>
                {allBanksByCode.length > 0 && (
                  <div>
                    <p className="font-nunito font-bold py-0">
                      Choose Your Bank:
                  </p>
                    <select
                      required
                      onChange={(e) => {
                        const index = e.nativeEvent.target.selectedIndex;
                        const selBankName = e.nativeEvent.target[index].text;
                        setSignUpDetails({
                          ...signUpDetails,
                          bankCode: e.target.value,
                          bankName: selBankName,
                        });
                      }}
                      name="bankCode"
                      id="bankCode"
                      className="outline-none bg-transparent border-b-2 border-gray-600 mb-0 rounded-sm font-nunito h-8 text-decoration-none w-full"
                    >
                      <option value=""> </option>
                      {allBanksByCode.map((bank) => {
                        return (
                          <option key={bank.id} value={bank.code}>
                            {bank.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
                <div>
                  <p className="font-nunito font-bold py-0">
                    Choose Your Account Type:
                </p>
                  <select
                    required
                    onChange={(e) => {
                      setSignUpDetails({
                        ...signUpDetails,
                        accountType: e.target.value,
                      });
                    }}
                    name="accountType"
                    id="accountType"
                    className="outline-none bg-transparent border-b-2 border-gray-600 mb-0 rounded-sm font-nunito h-8 text-decoration-none w-full"
                  >
                    <option value=""> </option>

                    <option value="user">User</option>
                    <option value="merchant">Merchant</option>
                    <option value="dispatch_rider">Dispatch Rider</option>
                  </select>
                </div>

                <div className="text-center pb-12">
                  <CustomButton
                    execFunc={() => {
                      if (formIsFilled()) {
                        setIsLoading(true);
                        submitSignUpForm(signUpDetails);
                      } else {
                        setShowModal(true);
                        setModalContent({
                          title: "Form Incomplete",
                          message: "All fields are required",
                        });
                      }
                    }}
                    text="Register"
                    fontSize={"1.4rem"}
                  />
                </div>
              </div>
            )}
        </form>
      </div>
    </div>
  );
}
