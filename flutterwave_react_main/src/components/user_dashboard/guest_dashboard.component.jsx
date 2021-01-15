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

export default function GuestDashboard(props) {
  const history = useHistory();
  const [cartItems, setCartItems] = useState([]);
  const [userDetails, setUserDetails] = useState({
    username: "Guest",
    accountNumber: "N/A",
    bankName: "N/A",
  });
  const [currentPage, setCurrentPage] = useState("cart");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });
  const [selectedCartItems, setSelectedCartItems] = useState([]);
  const [guestName, setGuestName] = useState("");
  const [currency, setCurrency] = useState("");
  const closeModal = () => {
    setShowModal(false);
  };

  const handleShowModal = (title, message) => {
    setShowModal(true);
    setModalContent({ title: title, message: message });
  };

  useEffect(() => {
    (async function loadCartItems() {
      getCartItems();
    })();
  }, []);

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

  const getCartItems = async () => {
    let items = JSON.parse(window.localStorage.getItem("cartItems"));
    items = items == null ? [] : items;
    items.forEach((item) => {
      item.username =
        window.localStorage.getItem("guestName") != null
          ? window.localStorage.getItem("guestName")
          : "guest";
      item.email =
        window.localStorage.getItem("guestEmail") != null
          ? window.localStorage.getItem("guestEmail")
          : "N/A";
    });
    setCartItems([...items]);
  };

  const deleteCartItem = (itemId) => {
    let items = JSON.parse(window.localStorage.getItem("cartItems"));
    items = items == null ? [] : items;
    let newItems = items.filter((item) => {
      return item._id != itemId;
    });
    window.localStorage.setItem("cartItems", JSON.stringify(newItems));
    setCartItems([...newItems]);
  };

  const getItemsToOrder = (selectedOnly) => {
    const name = window.localStorage.getItem("guestName")
      ? window.localStorage.getItem("guestName")
      : "guest";
    const email = window.localStorage.getItem("guestEmail")
      ? window.localStorage.getItem("guestEmail")
      : "N/A";
    if (selectedOnly) {
      if (selectedCartItems.length === 0) {
        return [];
      } else {
        let selectedItems = selectedCartItems.map((item) => {
          return {
            cartId: item._id,
            productId: item.productId,
            quantity: item.itemQuantity,
          };
        });
        return {
          username: name,
          email: email,
          items: [...selectedItems],
        };
      }
    } else {
      if (cartItems.length === 0) {
        return [];
      } else {
        let cartItemsToOrder = cartItems.map((item) => {
          return {
            cartId: item._id,
            productId: item.productId,
            quantity: item.itemQuantity,
          };
        });
        return {
          username: name,
          email: email,
          items: [...cartItemsToOrder],
        };
      }
    }
  };

  const processMultiplePayments = async (selected) => {
    const connectUrl = apiUrl + "orders/guest/multiple";
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
        data: { productIdsAndQuantities: itemsToOrder },
        headers: {
          Authorization: "Bearer ",
        },
        url: connectUrl,
      });
      if (response.data.status === "Failed") {
        handleShowModal("Failed", response.data.message);
      } else {
        itemsToOrder.items.forEach((item) => {
          deleteCartItem(item.cartId);
        });
        window.location.assign(response.data.link);
      }
    } catch (err) {
      handleShowModal("Failed", "We are having trouble placing your order");
    }
  };

  const orderSingleItem = async (itemToOrder, cartId) => {
    let connectUrl = apiUrl + "orders/guest/single";
    try {
      const response = await axios({
        method: "post",
        data: { ...itemToOrder, cartId: cartId },
        headers: {
          Authorization: "Bearer ",
        },
        url: connectUrl,
      });
      if (response.data.status === "Failed") {
        handleShowModal("Failed", "Unable to place your order");
      } else {
        deleteCartItem(cartId);
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
              <br />
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
                      <img src={empty} alt="404" className="w-productDetail" />
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
