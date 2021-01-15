import React, { useContext, useEffect, useState } from "react";
import MerchantDetail from "../global_components/merchant_detail.component";
import MerchantEditProduct from "./merchant_edit_product.component";
import RiderDetail from "../global_components/rider_detail.component";
import Transaction from "../global_components/transaction.component";
import UserHeader from "../global_components/user_header.component";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/user.context";
import axios from "axios";
import { apiUrl } from "../../configParams";
import Modal from "../global_components/modal.component";
import PayFee from "../global_components/pay_fee.component";
import empty from '../../assets/images/empty.jpg';

export default function MerchantDashboard(props) {
  const history = useHistory();
  const [state, dispatch] = useContext(UserContext);
  const [userDetails, setUserDetails] = useState({});
  const [allRiders, setAllRiders] = useState([]);
  const [rider, setRider] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });

  const closeModal = () => {
    setShowModal(false);
  };

  const handleShowModal = (title, message) => {
    setShowModal(true);
    setModalContent({ title: title, message: message });
  };

  const userToken = state.token;
  const merchantId = state.id;

  useEffect(() => {
    (async function getUserDet() {
      await getUserDetails();
    })();
  }, []);

  useEffect(() => {
    (async function getRiders() {
      await getAllRiders();
    })();
    (async function getMerchRider() {
      await getMerchantRider();
    })();
    (async function getProds() {
      await getAllProducts();
    })();
  }, []);

  useEffect(() => {
    (async function getUserDet() {
      await getAllOrders();
    })();
  }, []);

  const getUserDetails = async () => {
    try {
      const response = await axios.get(apiUrl + "users/" + merchantId, {
        headers: {
          Authorization: "Bearer " + userToken,
        },
      });
      setUserDetails(response.data.data.user);
    } catch (err) {
      handleShowModal("Error", "Failed to load Resource");
    }
  };

  const getAllRiders = async () => {
    try {
      const response = await axios.get(apiUrl + "users/dispatch-riders", {
        headers: {
          Authorization: "Bearer " + userToken,
        },
      });
      setAllRiders(response.data.data.riders);
    } catch (err) {
      handleShowModal("Error", "Failed to load Resource");
    }
  };

  const getMerchantRider = async () => {
    try {
      const response = await axios.get(
        apiUrl + "merchant-dispatcher/dispatchers/" + merchantId,
        {
          headers: {
            Authorization: "Bearer " + userToken,
          },
        }
      );
      setRider(response.data.data.dispatchers[0]);
    } catch (err) {
      handleShowModal("Error", "Failed to load Resource");
    }
  };

  const getAllProducts = async () => {
    try {
      const response = await axios.get(apiUrl + "products/merchant", {
        headers: {
          Authorization: "Bearer " + userToken,
        },
      });
      setProducts(response.data.data.products);
    } catch (err) {
      handleShowModal("Error", "Failed to load Resource");
    }
  };

  const deleteProduct = async (merchantId, productId) => {
    try {
      const response = await axios({
        method: "delete",
        headers: {
          Authorization: "Bearer " + userToken,
        },
        url: apiUrl + "products/" + productId,
        data: {
          merchantId: merchantId,
          dispatcherId: productId,
        },
      });
      if (response.data.status === "success") {
        await getAllProducts();
        handleShowModal("Success", "Deleted Successfully");
      }
    } catch (err) {
      handleShowModal("Error", "Failed to load Resource");
    }
  };

  const addMerchantToRider = async (merchantId, dispatcherId) => {
    try {
      const response = await axios({
        method: "patch",
        headers: {
          Authorization: "Bearer " + userToken,
        },
        url: apiUrl + "merchant-dispatcher",
        data: {
          merchantId: merchantId,
          dispatcherId: dispatcherId,
        },
      });
      if (response.data.status === "success") {
        await getMerchantRider();
        handleShowModal("Success", "Added Successfully");
      } else {
        handleShowModal("Failed", response.data.data.message);
      }
    } catch (err) {
      handleShowModal("Error", "Failed to load Resource");
    }
  };
  const getAllOrders = async () => {
    try {
      const response = await axios.get(apiUrl + "orders/", {
        headers: {
          Authorization: "Bearer " + userToken,
        },
      });
      setOrders(response.data.data.orders);
    } catch (err) {
      handleShowModal("Error", "Failed to load Resource");
    }
  };

  return (
    <div className="max-w-full w-full my-2 px-8">
      {showModal && (
        <Modal
          closeModal={() => {
            closeModal();
          }}
          message={modalContent.message}
          title={modalContent.title}
        />
      )}
      {userDetails.active === 0 && (
        <PayFee userDetails={userDetails} token={userToken} />
      )}

      {userDetails.active === 1 && (
        <div className="w-full h-full ">
          <div className="flex flex-row justify-between items-center mb-3">
            <UserHeader
              userType="merchant"
              riders={allRiders}
              addMerchantToRider={addMerchantToRider}
              merchantId={merchantId}
            />
          </div>
          <div className="w-full grid grid-flow-row gap-5 grid-cols-body">
            <div className="">
              <div className="w-full rounded-3xl bg-yellow-100 shadow-around px-6 py-6">
                <MerchantDetail
                  merchantDetails={userDetails}
                  userType="merchant"
                />
                <br></br>
                <RiderDetail userType="dispatch" riderDetails={rider} />
              </div>
            </div>
            <div className="max-w-full min-w-0">
              <div className="w-full p-6 rounded-3xl shadow-around">
                <div className="w-full">
                  <div className="flex flex-row justify-between items-center mb-6">
                    <h3 className="text-2xl font-nunito font-bold">
                      Your Products
                    </h3>
                    <p
                      onClick={() => {
                        history.push(history.location.pathname + "/product");
                      }}
                      className="py-2 px-6 rounded-xl cursor-pointer text-md font-nunito text-yellow-50 bg-yellow-500 font-bold shadow-md"
                    >
                      Add New Product
                    </p>
                  </div>
                  <div className="w-full h-80 py-4-400 flex flex-row py-3 overflow-x-scroll z-index-0">
                    {products.length === 0 ? (
                      <div className="w-3/5 h-full font-nunito m-auto font-bold text-lg  text-center flex flex-row justify-center items-center">
                        <h2 className="p-8 rounded-xl bg-yellow-100">
                          No products attached to your account. Add new products
                        </h2>
                      </div>
                    ) : (
                        products.map((product) => {
                          return (
                            <MerchantEditProduct
                              key={product.name}
                              product={product}
                              deleteProduct={deleteProduct}
                              merchantId={merchantId}
                            />
                          );
                        })
                      )}
                  </div>
                </div>
                <br />
                <div>
                  <h3 className="text-2xl font-nunito font-bold">
                    Your Orders
                  </h3>
                  {orders.length <= 0 && (
                    <>
                      <>
                        <div className="flex flex-row items-center justify-center">
                          <img
                            src={empty}
                            alt="404"
                            className="w-productDetail"
                          />
                        </div>
                        <h3 className="font-nunito font-bold text-xl pt-3 text-center">
                          No Items In Cart
                      </h3>
                      </>
                    </>
                  )}
                  {orders.length > 0 && (
                    <>
                      <div className="h-10 py-1 px-6 my-1 rounded-2xl overflow-none w-full flex flex-row justify-between items-center font-nunito font-bold font-lg">
                        <p>Image</p>
                        <p>Product Name</p>
                        <p>Currency</p>
                        <p>Total Paid</p>
                        <p>Quantity</p>
                        <p>Revenue</p>
                      </div>
                      <div className="w-full h-80 py-4 px-4 overflow-x-auto">
                        {orders.map((order) => {
                          return (
                            <Transaction
                              key={order._id}
                              cut={order.merchantCut}
                              price={order.totalProductPricePaid}
                              name={order.productName}
                              imageLink={order.productImageLink}
                              currency={order.currencyCode}
                              quantity={order.quantity}
                            />
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
