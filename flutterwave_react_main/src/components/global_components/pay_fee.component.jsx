import axios from 'axios';
import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { apiUrl } from '../../configParams';
import UserContext from '../../context/user.context'
import CustomButton from './button.component'
import Modal from './modal.component';

export default function PayFee(props) {
  const history = useHistory()
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });
  const userDetails = props.userDetails;
  const userToken = props.token;

  const closeModal = () => {
    setShowModal(false);
  };

  const handleShowModal = (title, message) => {
    setShowModal(true)
    setModalContent({ title: title, message: message })
  }

  const payFee = async () => {
    const url = apiUrl + "orders/registration/";
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: "Bearer " + userToken,
        },
      });
      if (response.data.status == "Failed") {
        handleShowModal("Failed", "Couldn't complete fee payment")
      } else {
        let link = response.data.link;
        window.location.assign(link)
      }
    } catch (err) {
      handleShowModal("Failed", "Couldn't complete fee payment for some reason, contact administrator")

    }

  }



  return (
    <div>
      {showModal && (
        <Modal
          closeModal={() => {
            closeModal();
          }}
          message={modalContent.message}
          title={modalContent.title}
        />
      )}
      <h2 className="text-center font-nunito pt-12 text-4xl font-extrabold"
      >Pay Registration Fee
      </h2>
      <p className="text-center font-nunito pt-12 text-lg font-bold">Refresh this page once you have completed successful payment</p>
      <div className="w-full h-96 flex flex-row justify-center items-center">
        <CustomButton text="Pay Fee" fontSize="3.2rem" execFunc={() => {
          payFee()
        }} />
      </div>
    </div>
  )
}