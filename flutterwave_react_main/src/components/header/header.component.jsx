import React, { useContext, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import search from "../../assets/images/search.svg";
import UserContext from "../../context/user.context";
import CustomButton from "../global_components/button.component";
import cart from "../../assets/images/cart.svg";

export default function Header(props) {
  const history = useHistory();
  const location = useLocation();

  const [state, dispatch] = useContext(UserContext);


  const handleSignUp = () => {
    history.push("/sign-up");
  };

  const goToDashboard = () => {
    let path =
      state.accountType === "dispatch_rider" ? "dispatch" : state.accountType;
    history.push("/" + path);
  };

  const handleLogout = (oldState, dispatch) => {
    let action = { type: "LOGOUT", payload: {} };
    dispatch(action);
    history.replace(`/login`);
  };

  const handleLogin = () => {
    history.push("/login");
  };

  const goHome = () => {
    history.push("/");
  };

  return (
    <div className="">
      <div className="max-w-screen-2xl mx-auto ">
        <header className="w-full h-20 flex flex-row justify-between items-center px-3">
          <div
            className="h-full flex flex-row items-center w-auto px-3 cursor-pointer"
            onClick={goHome}
          >
            <img
              src={logo}
              alt="logo"
              className="max-h-full h-full w-auto pr-3 py-6 cursor-pointer"
            />
            <h2 className="font-nunito text-4xl py-7 font-extrabold align-middle cursor-pointer">
              Jumga
            </h2>
          </div>
          <div>
            <div className="flex flex-row justify-between items-center">
              {location.pathname === "/" && (
                <div className="bg-blue-search rounded-xl border-2 w-96 h-full w-50 flex items-center mx-3">
                  <img
                    src={search}
                    alt="search"
                    className="inline w-9 h-9 py-2 px-3 align-middle "
                  ></img>
                  <input
                    type="text"
                    placeholder="Search"
                    className="outline-none bg-transparent w-full pr-3 text-gray-800"
                  />
                </div>
              )}
              {!state.loggedIn ? (
                <>
                  <span
                    onClick={() => {
                      handleSignUp();
                    }}
                    className="mx-2 font-nunito font-bold text-md text-gray-800 hover:text-yellow-700 my-auto cursor-pointer"
                  >
                    Sign Up
                  </span>
                  <div className="ml-4">
                    <CustomButton
                      fontSize={"null"}
                      execFunc={handleLogin}
                      text="Login"
                    />
                  </div>
                  <div
                    onClick={() => {
                      history.push("/guest");
                    }}
                    className="h-full overflow-hidden flex flex-row mx-4"
                  >
                    <img
                      className="h-8 w-auto object-contain"
                      src={cart}
                      alt="cart item"
                    />
                  </div>
                </>
              ) : (
                <>
                  <span
                    onClick={() => {
                      goToDashboard();
                    }}
                    className="mx-2 font-nunito font-bold text-md text-gray-800 hover:text-yellow-700 my-auto cursor-pointer"
                  >
                    Dashboard
                  </span>
                  {state.accountType === "user" && (
                    <div
                      onClick={() => {
                        history.push("/user");
                      }}
                      className="h-full overflow-hidden flex flex-row mx-4"
                    >
                      <img
                        className="h-8 w-auto object-contain"
                        src={cart}
                        alt="cart item"
                      />
                    </div>
                  )}

                  <div className="ml-4">
                    <CustomButton
                      fontSize={"null"}
                      execFunc={() => {
                        handleLogout(state, dispatch);
                      }}
                      text="Log Out"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
      </div>
      {/* <hr /> */}
    </div>
  );
}
