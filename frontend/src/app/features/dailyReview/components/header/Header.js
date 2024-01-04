import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";
import UploadModal from "./UploadModal";
import FormDisabledExample from "../settingsTextForm/settingsForm";
const { REACT_APP_API_BASE_URL } = process.env;

export default function Header() {
  const [showModal, setShowModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleShow = () => {
    setShowModal(true);
    setShowSuccessMessage(false);
  };

  const handleClose = () => setShowModal(false);

  const uploadFile = async () => {
    try {
      var fileInput = document.getElementById("fileInput");
      var file = fileInput.files[0];
      if (file) {
        var formData = new FormData();
        formData.append("file_upload", file);

        fetch(`${REACT_APP_API_BASE_URL}/upload-file`, {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            setShowSuccessMessage(true);

            setTimeout(() => {
              setShowSuccessMessage(false);
              handleClose();
            }, 1000);
          })
          .catch((error) => {
            console.error("Error uploading file:", error);
          });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleShowFiles = () => {
    navigate("/download");
  };

  const gotoHome = () => {
    navigate("/");
  };

  const handleConfiguration = () => {
    navigate("/configuration");
  };

  return (
    <div>
      <div className="d-flex justify-content-between">
        <a
          href="/home"
          className="logo d-flex justify-content-center align-items-center"
          onClick={gotoHome}
        >
          <img src="./crusader-logo.svg" alt="Logo" />
        </a>
        <div className="header-right">
          {location.pathname !== "/download" && (
            <button
              className="btn btn-secondary font-lg"
              onClick={handleShowFiles}
            >
              Show Files
            </button>
          )}
          <button className="btn blue-btn font-lg" onClick={handleShow}>
            Upload
          </button>
          <button
            className="btn btn-info font-lg"
            onClick={handleConfiguration}
          >
            Configuration
          </button>
        </div>
      </div>

      <div className="content">
        <div id="root"></div>
      </div>

      <UploadModal
        showModal={showModal}
        handleClose={handleClose}
        uploadFile={uploadFile}
        showSuccessMessage={showSuccessMessage}
      />
    </div>
  );
}
