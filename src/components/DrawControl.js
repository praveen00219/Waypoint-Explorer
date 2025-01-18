import React, { useState } from "react";
import { MdClose } from "react-icons/md";

function DrawControl({ enableDrawing, drawType, onDrawButtonClick }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // console.log("drowTpye :", drawType);
  // Open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="draw-control">
      {/* Drow Button */}
      <button
        className="drow-button"
        onClick={openModal}
        // disabled={drawType !== null}
      >
        Drow
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlays">
          <div className="modal-contents">
            <div className="modal-headers">
              <h5>Mission Creation</h5>
              <button
                className="close-btn border-0 px-3 py-1 bg-light"
                onClick={closeModal}
              >
                <MdClose className="close-btn-icon " />
              </button>
            </div>
            <div className="modal-bodys">
              <h6>Waypoint Navigation</h6>
              <p className="text-content">
                Click on the map to mark points of the route and then press ↵ to
                complete the route.
              </p>
            </div>
            <div className="modal-footers">
              <button
                onClick={() => {
                  onDrawButtonClick(drawType);
                  enableDrawing();
                  closeModal();
                }}
                className="generate-data-button"
              >
                Generate Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DrawControl;
