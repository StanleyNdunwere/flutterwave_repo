import React, { useContext, useEffect, useState } from "react";
import CustomButton from "../global_components/button.component";
import addSign from "../../assets/images/addSign.svg";
import minus from "../../assets/images/minus.svg";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../configParams";
import UserContext from "../../context/user.context";
import Modal from "../global_components/modal.component";
import { v4 as uuidv4 } from "uuid";
export default function Product(props) {
  const { id } = useParams();
  const history = useHistory();
  const [state, dispatch] = useContext(UserContext);
  const [productInfo, setProductInfo] = useState({});
  const [purchaseInfo, setPurchaseInfo] = useState({
    productId: id,
    quantity: 1,
  });
  const [cartItem, setCartItem] = useState({ itemQuantity: 1 });
  const [guestEmail, setGuestEmail] = useState("");
  const [stayOnPage, setStayOnPage] = useState(false);
  const isLoggedIn = state.token != null;
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });

  const closeModal = () => {
    setShowModal(false);
    if (!stayOnPage) history.push("/");
  };

  const handleShowModal = (title, message) => {
    setShowModal(true);
    setModalContent({ title: title, message: message });
  };

  const addCartItemToLocalStorage = (cartItem) => {
    if (state.token == null && (guestEmail == null || guestEmail == "")) {
      handleShowModal("Cannot Proceed", "Please input a reference name");
      setStayOnPage(true);
    } else {
      let oldItems = JSON.parse(window.localStorage.getItem("cartItems"));
      oldItems = oldItems == null ? [] : oldItems;
      let uniqueItems = oldItems.filter((item) => {
        return item.productId != cartItem.productId;
      });

      let newCartItem = { ...cartItem, _id: uuidv4().split("-").join("") };
      window.localStorage.setItem(
        "cartItems",
        JSON.stringify([...uniqueItems, newCartItem])
      );
      window.localStorage.setItem("guestEmail", guestEmail);
      window.localStorage.setItem("guestName", guestEmail.split("@")[0]);
      setStayOnPage(false);
      handleShowModal("Success", "Saved to cart successfully");
    }
  };

  useEffect(() => {
    (async function getProduct() {
      getSingleProductWithId();
    })();
  }, []);

  const handleSinglePayment = async () => {
    let connectUrl =
      state.token != null
        ? apiUrl + "orders/single"
        : apiUrl + "orders/guest/single";
    if (state.token == null && (guestEmail == null || guestEmail == "")) {
      handleShowModal("Cannot Proceed", "Please input a reference email");
      setStayOnPage(true);
    } else {
      const itemOrderInfo = {
        ...purchaseInfo,
        name: guestEmail.split("@")[0],
        email: guestEmail,
      };
      try {
        const response = await axios({
          method: "post",
          data: itemOrderInfo,
          headers: {
            Authorization: "Bearer " + state.token ?? "",
          },
          url: connectUrl,
        });
        if (response.data.status === "Failed") {
          handleShowModal("Failed", "Unable to place your order");
        } else {
          setStayOnPage(false);
          window.location.assign(response.data.link);
        }
      } catch (err) {
        handleShowModal("Failed", "We are having trouble placing your order");
      }
    }
  };

  const getSingleProductWithId = async () => {
    try {
      const response = await axios.get(apiUrl + "products/all/" + id, {});
      setProductInfo(response.data.data.product);
      const loadedProductInfo = response.data.data.product;
      setCartItem({
        ...cartItem,
        userId: state.id,
        productId: loadedProductInfo._id,
        productName: loadedProductInfo.name,
        price: loadedProductInfo.price,
        deliveryCost: loadedProductInfo.deliveryCost,
        currencyCode: loadedProductInfo.currencyCode,
        productImageLink: loadedProductInfo.productImageLink,
      });
    } catch (err) {
      handleShowModal("Failed", "Couldn't load resource");
    }
  };

  const handleIncreaseQty = () => {
    let newQty = purchaseInfo.quantity + 1;
    setCartItem({ ...cartItem, itemQuantity: newQty });
    setPurchaseInfo({ ...purchaseInfo, quantity: newQty });
  };

  const handleDecreaseQty = () => {
    if (purchaseInfo.quantity > 1) {
      let newQty = purchaseInfo.quantity - 1;
      setCartItem({ ...cartItem, itemQuantity: newQty });
      setPurchaseInfo({ ...purchaseInfo, quantity: newQty });
    }
  };

  const createNewCartItemLoggedIn = async () => {
    try {
      const response = await axios({
        method: "post",
        data: cartItem,
        headers: {
          Authorization: "Bearer " + state.token,
        },
        url: apiUrl + "cart",
      });
      if (response.data.status === "Failed") {
        handleShowModal("Failed", "Unable to save your cart Item");
      }
      handleShowModal("Success", "Saved to cart successfully");
    } catch (err) {
      handleShowModal("Failed", "We are having trouble saving your cart Item");
    }
  };

  return (
    <div className="w-full my-10 p-8 px-28 h-productDetail grid grid-cols-2 items-center">
      {showModal && (
        <Modal
          closeModal={() => {
            closeModal();
          }}
          message={modalContent.message}
          title={modalContent.title}
        />
      )}
      <div className="mx-10 w-productDetail overflow-hidden shadow-around rounded-4xl h-productDetail self-start">
        <img
          src={`${productInfo.productImageLink}`}
          className="mx-auto w-full h-full object-cover"
          alt="product"
        />
      </div>
      <div className="h-full flex flex-row items-center">
        <div className="w-4/5 h-auto">
          <h2 className="font-nunito font-extrabold mb-5 text-3xl">
            {productInfo.name}
          </h2>
          <p>{productInfo.description}</p>
          <p className="py-3 font-bold font-nunito text-lg">
            Price:{" "}
            <span className="font-extrabold text-yellow-400">
              {productInfo.currencyCode} {productInfo.price}
            </span>
          </p>
          <p className="pb-3 font-bold font-nunito text-lg">
            Delivery:{" "}
            <span className="font-extrabold text-yellow-400">
              {productInfo.currencyCode} {productInfo.deliveryCost}
            </span>
          </p>
          <div className="mb-4 flex flex-row items-start h-10 w-full">
            <div
              onClick={() => {
                handleDecreaseQty();
              }}
              className=" p-3 bg-yellow-300 h-full w-10 rounded-lg border-1 hover:bg-yellow-500"
            >
              <img
                src={minus}
                className="no-repeat cover"
                alt="add more items"
              />
            </div>
            <div className="h-full p-2 px-4 w-auto text-xl font-bold font-nunito">
              <span>{purchaseInfo.quantity}</span>
            </div>
            <div
              onClick={() => {
                handleIncreaseQty();
              }}
              className=" p-3 bg-yellow-300 h-full w-10 rounded-lg hover:bg-yellow-500 border-1"
            >
              <img
                src={addSign}
                className="no-repeat cover"
                alt="add more items"
              />
            </div>
          </div>
          {state.token == null && (
            <div>
              <p className="font-nunito font-bold py-0">
                What email do we attach to this order?
              </p>
              <input
                onChange={(e) => {
                  setGuestEmail(e.target.value);
                }}
                required
                name="name"
                type="text"
                className="outline-none w-3/5 bg-transparent border-b-2 border-gray-600 mb-3 rounded-sm font-nunito font-lg h-8 text-decoration-none"
              />
            </div>
          )}
          {!(
            isLoggedIn &&
            (state.accountType === "merchant" ||
              state.accountType === "dispatch_rider")
          ) && (
            <div className="flex flex-row mt-8">
              <div className="mr-4">
                <CustomButton
                  execFunc={() => handleSinglePayment()}
                  fontSize={"1.2rem"}
                  text="Pay Now"
                />
              </div>
              <div>
                <CustomButton
                  fontSize={"1.2rem"}
                  text="Add To Cart"
                  execFunc={() => {
                    if (isLoggedIn) {
                      createNewCartItemLoggedIn();
                    } else {
                      addCartItemToLocalStorage(cartItem);
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
