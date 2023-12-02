import React, { useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

const UploadModal = ({
  showModal,
  handleClose,
  uploadFile,
  showSuccessMessage,
}) => {
  // reset success message after it is shown
  useEffect(() => {
    if (showSuccessMessage) {
      const timeoutId = setTimeout(() => {
        handleClose(); // Close modal
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [showSuccessMessage, handleClose]);

  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Upload Excel File</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input type="file" id="fileInput" />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={uploadFile}>
          Upload
        </Button>
      </Modal.Footer>

      {showSuccessMessage && (
        <div
          id="uploadMessage"
          className="modal fade show"
          style={{ display: "block", color: "green" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-body">File uploaded successfully!</div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default UploadModal;
