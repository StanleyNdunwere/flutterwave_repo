import React, { useContext, useEffect, useState } from "react";
import CustomButton from "../global_components/button.component";
import addSign from "../../assets/images/addSign.svg";
import minus from "../../assets/images/minus.svg";
import { useHistory, useParams } from "react-router-dom";
import { apiUrl } from "../../configParams";
import axios from "axios";
import UserContext from "../../context/user.context";
import Modal from "../global_components/modal.component";

export default function ProductEditCreate(props) {
  const history = useHistory();
  const [state, dispatch] = useContext(UserContext);
  const userToken = state.token;
  const merchantId = state.id;
  const [productInfo, setProductInfo] = useState({
    merchantId: state.id,
  });
  const [image, setImage] = useState({
    productImageLink: apiUrl + "uploads/shopping_bag.png",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    (async function fetchProduct() {})();
  }, []);

  const createNewProduct = async () => {
    let formData = new FormData();
    for (const [key, value] of Object.entries(productInfo)) {
      formData.append(`${key}`, value);
    }
    try {
      const response = await axios({
        method: "post",
        data: formData,
        headers: {
          Authorization: "Bearer " + userToken,
          "Content-Type": "multipart/form-data",
        },
        url: apiUrl + "products",
      });
      if (response.data.status === "Failed") {
        setShowModal(true);
        setModalContent({
          title: "Failed",
          message: response.data.message,
        });
      } else {
        history.goBack();
      }
    } catch (err) {
      return null;
    }
  };

  return (
    <>
      {showModal && (
        <Modal
          closeModal={() => {
            closeModal();
          }}
          message={modalContent.message}
          title={modalContent.title}
        />
      )}
      <div className="">
        <h3 className="font-nunito text-3xl font-extrabold mx-auto text-center">
          Create Product
        </h3>
        <form>
          <div className="w-full my-10 p-8 px-28 h-productDetail grid grid-cols-2 items-center">
            <div
              style={{ zIndex: "-10" }}
              className="mx-10 w-productDetail overflow-hidden shadow-around rounded-4xl h-productDetail self-start z-index-0"
            >
              <div className=" mx-auto w-full h-full flex justify-center items-center relative">
                <img
                  src={image.productImageLink}
                  alt="productImage"
                  className="z-index-0 absolute top-0 left-0 w-full h-full object-cover"
                />
                <div className="bg-black opacity-40 w-full h-full top-0 absolute z-index-10"></div>
                <div className="w-3/5 h-auto bg-transparent z-index-20 flex-col justify-center items-center relative">
                  <input
                    onChange={(e) => {
                      setProductInfo({
                        ...productInfo,
                        productImageLink: e.target.files[0],
                      });
                      setImage({
                        productImageLink: URL.createObjectURL(
                          e.target.files[0]
                        ),
                      });
                    }}
                    type="file"
                    name="productImageLink"
                    className="text-6xl opacity-0  absolute left-0 top-0"
                  />
                  <p className="z-20 px-6 py-3 w-4/5 m-auto cursor-pointer rounded-2xl text-center shadow-around overflow-hidden bg-yellow-500 text-yellow-50 font-nunito font-bold text-2xl">
                    Choose Image
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="w-4/5">
                <div>
                  <p className="font-nunito font-bold py-0  text-yellow-600">
                    Set Product name:
                  </p>
                  <input
                    onChange={(e) => {
                      setProductInfo({ ...productInfo, name: e.target.value });
                    }}
                    name="productName"
                    type="text"
                    className="outline-none bg-transparent border-b-2 border-gray-600 mb-3 rounded-sm font-nunito font-extrabold text-2xl h-auto text-decoration-none w-full py-3"
                  />
                </div>
                <div>
                  <p className="font-nunito font-bold py-0  text-yellow-600">
                    Description:
                  </p>
                  <textarea
                    onChange={(e) => {
                      setProductInfo({
                        ...productInfo,
                        description: e.target.value,
                      });
                    }}
                    name="description"
                    type="text"
                    rows={5}
                    className="outline-none bg-transparent border-b-2 border-gray-600 mb-3 rounded-sm font-nunito h-auto text-decoration-none w-full py-3"
                  />
                </div>
                <div>
                  <p className="font-nunito font-bold py-0  text-yellow-600">
                    Set Product Price:
                  </p>
                  <input
                    onChange={(e) => {
                      setProductInfo({ ...productInfo, price: e.target.value });
                    }}
                    name="price"
                    type="numbers"
                    className="outline-none bg-transparent border-b-2 border-gray-600 mb-3 rounded-sm font-nunito h-auto text-decoration-none w-full py-3"
                  />
                </div>
                <div>
                  <p className="font-nunito font-bold py-0  text-yellow-600">
                    Set Product Currency:
                  </p>
                  <select
                    onChange={(e) => {
                      setProductInfo({
                        ...productInfo,
                        currencyCode: e.target.value,
                      });
                    }}
                    className="outline-none bg-transparent border-b-2 border-gray-600 mb-3 rounded-sm font-nunito h-auto text-decoration-none w-full py-3"
                    name="currencyCode"
                    id="currencCode"
                  >
                    <option value=""></option>
                    <option value="NGN">Naira</option>
                    <option value="GHS">Ghanian Cedis</option>
                    <option value="GBP">Pounds</option>
                    <option value="KES">Kenyan Shillings</option>
                  </select>
                </div>
                <div>
                  <p className="font-nunito font-bold py-0 text-yellow-600">
                    Set Delivery Cost Per Unit Product:
                  </p>
                  <input
                    onChange={(e) => {
                      setProductInfo({
                        ...productInfo,
                        deliveryCost: e.target.value,
                      });
                    }}
                    name="deliveryCost"
                    type="numbers"
                    className="outline-none bg-transparent border-b-2 border-gray-600 mb-3 rounded-sm font-nunito h-auto text-decoration-none w-full py-3"
                  />
                </div>
                <div className="flex flex-row mt-4">
                  <div className="mr-4">
                    <CustomButton
                      fontSize={"1.2rem"}
                      text="Save Changes"
                      execFunc={() => {
                        createNewProduct();
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
