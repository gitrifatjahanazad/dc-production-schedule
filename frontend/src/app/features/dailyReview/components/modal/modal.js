import React, { useState } from "react";
import UploadModal from "./uploadModal.js"; // Update the path accordingly
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css"; // Make sure to import your styles

export default function Header(props) {
  const [showModal, setShowModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleShow = () => {
    setShowModal(true);
    setShowSuccessMessage(false); // Reset success message when modal is opened
  };

  const handleClose = () => setShowModal(false);

  const uploadFile = async () => {
    try {
      // After successful upload, set showSuccessMessage to true
      setShowSuccessMessage(true);

      // Close the modal after 1 second
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <div className="header">
        <a href="#default" className="logo">
          <img src="./crusader-logo.svg" alt="Logo" />
          Daily Production Review System
        </a>
        <div className="header-right">
          <button className="active" onClick={handleShow}>
            Upload Files
          </button>
        </div>
      </div>

      <div className="content">
        <div id="root"></div>
      </div>

      <UploadModal
        class="modal fade"
        showModal={showModal}
        handleClose={handleClose}
        uploadFile={uploadFile}
      />

      {showSuccessMessage && (
        <div
          id="uploadMessage"
          className="modal fade"
          style={{ display: "block", color: "green" }}
        >
          <div className="modal fade" role="document">
            <div className="modal-content">
              <div className="modal-body">File uploaded successfully!</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
