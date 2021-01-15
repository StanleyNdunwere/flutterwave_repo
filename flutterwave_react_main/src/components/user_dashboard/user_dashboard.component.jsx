import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import MerchantDetail from "../global_components/merchant_detail.component";
import MerchantEditProduct from "../merchant_dashboard/merchant_edit_product.component";
import RiderDetail from "../global_components/rider_detail.component";
import Transaction from "../global_components/transaction.component";
import UserHeader from "../global_components/user_header.component";
import MerchantList from "../global_components/merchants_list_detail.component";
import Modal from "../global_components/modal.component";
import { apiUrl } from "../../configParams";
import UserContext from "../../context/user.context";
import axios from "axios";
import UserDetails from "./user_detail.component";
import CartItem from "./cart_item.component";
import empty from "../../assets/images/empty.jpg";

export default function UserDashboard(props) {
  const history = useHistory();
  const [state, dispatch] = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState("cart");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });
  const [selectedCartItems, setSelectedCartItems] = useState([]);
  const [reload, setReload] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  const handleShowModal = (title, message) => {
    setShowModal(true);
    setModalContent({ title: title, message: message });
  };

  const userToken = state.token;
  const userId = state.id;

  useEffect(() => {
    (async function getUserDet() {
      await getUserInfo();
    })();
  }, []);

  useEffect(() => {
    (async function getUserDet() {
      await getAllOrders();
    })();
  }, []);

  useEffect(() => {
    (async function getAllCartItems() {
      await getCartItems();
    })();
  }, []);

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

  const validateAllItemsAreSameCurrency = (items) => {
    if (items.length <= 1) {
      return true;
    }
    const checkCurrency = items[0].currencyCode;
    let dissimilarCurrencyCode = items.filter((item) => {
      return item.currencyCode != checkCurrency;
    });
    if (dissimilarCurrencyCode.length > 0) {
      return false;
    } else {
      return true;
    }
  };

  const getItemsToOrder = (selectedOnly) => {
    let itemsInfo = [];
    if (selectedOnly) {
      if (selectedCartItems.length == 0) {
        handleShowModal(
          "Cannot Proceed",
          "Please select a few items to proceed"
        );
        return [];
      } else {
        return selectedCartItems.map((item) => {
          return {
            cartId: item.itemId,
            productId: item.productId,
            quantity: item.quantity,
          };
        });
      }
    } else {
      if (cartItems.length == 0) {
        handleShowModal("Cannot Proceed", "You don't have items in your cart");
        return [];
      } else {
        return cartItems.map((item) => {
          return {
            cartId: item._id,
            productId: item.productId,
            quantity: item.itemQuantity,
          };
        });
      }
    }
  };

  const processMultiplePayments = async (selected) => {
    const connectUrl = apiUrl + "orders/multiple";
    const itemsToOrder = getItemsToOrder(selected);
    if (itemsToOrder.length === 0) {
      handleShowModal(
        "Cannot Proceed",
        "You must have cart items or select a few items to place an order"
      );
      return;
    }
    let itemsToValidate = selected ? selectedCartItems : cartItems;
    if (!validateAllItemsAreSameCurrency(itemsToValidate)) {
      handleShowModal(
        "Cannot Proceed",
        "Only items of the same CURRENCY type can be ordered as a group. i.e you can only order items in NGN (Naira) as a group. Unselect the offending items and try again"
      );
      return;
    }
    try {
      const response = await axios({
        method: "post",
        data: { productIdsAndQuantities: { items: itemsToOrder } },
        headers: {
          Authorization: "Bearer " + state.token,
        },
        url: connectUrl,
      });
      if (response.data.status === "Failed") {
        handleShowModal("Failed", response.data.message);
      } else {
        window.location.assign(response.data.link);
      }
    } catch (err) {
      handleShowModal("Failed", "We are having trouble placing your order");
    }
  };

  const getUserInfo = async () => {
    try {
      const response = await axios.get(apiUrl + "users/" + userId, {
        headers: {
          Authorization: "Bearer " + userToken,
        },
      });
      setUserDetails(response.data.data.user);
    } catch (err) {
      handleShowModal("Error", "Failed to load Resource");
    }
  };

  const getCartItems = async () => {
    try {
      const response = await axios.get(apiUrl + "cart/", {
        headers: {
          Authorization: "Bearer " + userToken,
        },
      });
      setCartItems(response.data.data.items);
    } catch (err) {
      handleShowModal("Error", "Failed to load Resource");
    }
  };

  const deleteCartItem = async (itemId) => {
    try {
      const response = await axios({
        method: "delete",
        headers: {
          Authorization: "Bearer " + userToken,
        },
        url: apiUrl + "cart/" + itemId,
      });
      if (response.data.status === "success") {
        getCartItems();
        handleShowModal("Success", "Cart Item deleted Successfully");
      }
    } catch (err) {
      handleShowModal("Error", "Failed to load Resource");
    }
  };

  const orderSingleItem = async (itemToOrder, cartId) => {
    let connectUrl = apiUrl + "orders/single";
    try {
      const response = await axios({
        method: "post",
        data: { ...itemToOrder, cartId: cartId },
        headers: {
          Authorization: "Bearer " + userToken,
        },
        url: connectUrl,
      });
      if (response.data.status === "Failed") {
        handleShowModal("Failed", "Unable to place your order");
      } else {
        window.location.assign(response.data.link);
      }
    } catch (err) {
      handleShowModal("Failed", "We are having trouble placing your order");
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
      <div className="w-full h-full ">
        <div className="flex flex-row justify-between items-center mb-3">
          <UserHeader
            userType="user"
            riders={[]}
            addMerchantToRider={null}
            merchantId={null}
          />
        </div>
        <div className="w-full grid grid-flow-row gap-5 grid-cols-body">
          <div className="">
            <div className="w-full rounded-3xl bg-yellow-100 shadow-around px-6 py-6">
              <UserDetails userDetails={userDetails} />
            </div>
          </div>
          <div className="max-w-full min-w-0">
            <div className="w-full p-6 rounded-3xl shadow-around">
              <div>
                <div className="w-full flex flex-row my-3">
                  <p
                    onClick={() => {
                      setCurrentPage("cart");
                    }}
                    className=" mr-4 font-nunito font-extrabold text-md px-4 py-2 bg-green-500 cursor-pointer rounded-xl shadow-around text-green-50 hover:bg-green-600"
                  >
                    View Cart
                  </p>
                  <p
                    onClick={() => {
                      setCurrentPage("orders");
                    }}
                    className="mr-4 font-nunito font-extrabold text-md px-4 py-2 bg-yellow-500 cursor-pointer rounded-xl shadow-around text-yellow-50 hover:bg-yellow-600"
                  >
                    View Orders
                  </p>
                </div>
              </div>
              <br />
              {currentPage === "cart" ? (
                <div>
                  <div className="flex flex-row justify-between items-center">
                    <h3 className="text-2xl font-nunito font-bold">
                      Your Cart Items:
                    </h3>
                    <div className="flex flex-row items-center">
                      {cartItems.length > 0 && (
                        <p
                          onClick={() => {
                            processMultiplePayments(false);
                          }}
                          className="font-nunito mr-4 font-bold px-2 py-2 bg-green-500 cursor-pointer rounded-xl shadow-around text-green-50 hover:bg-green-600"
                        >
                          Buy All Items
                        </p>
                      )}
                      {selectedCartItems.length > 0 && (
                        <p
                          onClick={() => {
                            processMultiplePayments(true);
                          }}
                          className="font-nunito mr-4  font-bold px-2 py-2 bg-yellow-500 cursor-pointer rounded-xl shadow-around text-green-50 hover:bg-green-600"
                        >
                          Buy Selected Items
                        </p>
                      )}
                    </div>
                  </div>
                  {cartItems.length <= 0 && (
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
                  )}

                  {cartItems.length > 0 && (
                    <>
                      <div className="h-10 py-1 px-8 my-1 rounded-2xl overflow-none w-full flex flex-row justify-between items-center font-nunito font-bold font-lg">
                        <p>Image</p>
                        <p>Product Name</p>
                        <p>Quantity</p>
                        <p>Currency</p>
                        <p>Price</p>
                        <p>Delivery fee</p>
                        <div className="flex flex-row items-center">
                          <p className="mx-2">Remove</p>
                          <p className="mx-2">Select</p>
                          <p className="mx-2">Buy Now</p>
                        </div>
                      </div>
                      <div
                        style={{ height: "400px" }}
                        className="w-full py-4 px-4 overflow-x-auto"
                      >
                        {cartItems.map((item) => {
                          return (
                            <CartItem
                              key={item._id}
                              setSelectedCartItems={setSelectedCartItems}
                              selectedCartItems={selectedCartItems}
                              delete={deleteCartItem}
                              item={item}
                              orderSingleItem={orderSingleItem}
                            />
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                  <div>
                    <h3 className="text-2xl font-nunito font-bold">
                      Your Orders:
                  </h3>
                    {orders.length <= 0 && (
                      <div className="flex flex-row items-center justify-center">
                        <img src={empty} alt="404" className="w-productDetail" />
                      </div>
                    )}
                    {orders.length > 0 && (
                      <>
                        <div className="h-10 py-1 px-6 my-1 rounded-2xl overflow-none w-full flex flex-row justify-between items-center font-nunito font-bold font-lg">
                          <p>Image</p>
                          <p>Product Name</p>
                          <p>Currency</p>
                          <p>Total Price</p>
                          <p>Quantity</p>
                          <p>Delivery Fee</p>
                        </div>
                        <div
                          style={{ height: "400px" }}
                          className="w-full py-4 px-4 overflow-x-auto"
                        >
                          {orders.map((order) => {
                            return (
                              <Transaction
                                key={order._id}
                                cut={order.totalDeliveryPricePaid}
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
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
