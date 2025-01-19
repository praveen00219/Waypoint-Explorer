import React from "react";
import { MdClose } from "react-icons/md";
import { calculateDistance } from "../utils/geoUtils";

function MissionModal({ waypoints, onClose, onInsertPolygon }) {
  // console.log("waypoints :", waypoints);

  return (
    <>
      {waypoints.length !== 0 && (
        <div className="modal1 mission-modal">
          <div className="mb-3 d-flex align-items-center justify-content-between">
            <h5 className="m-0 p-0">Mission Waypoints</h5>
            <button
              className="close-btn border-0 px-3 py-1 bg-light"
              onClick={onClose}
            >
              <MdClose className="close-btn-icon" />
            </button>
          </div>
          <table className="mt-2">
            <thead>
              <tr>
                <th>WP</th>
                <th>Coordinates</th>
                <th>Distance (m)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {waypoints.map((coord, index) => (
                <tr key={index}>
                  <td>({index.toString().padStart(2, "0")})</td>
                  <td>
                    {`${coord[0].toFixed(8)}° N`}, {`${coord[1].toFixed(8)}° S`}
                  </td>
                  <td>
                    {index > 0
                      ? calculateDistance(waypoints[index - 1], coord)
                      : "-"}
                  </td>
                  <td>
                    <div className="dropdown">
                      <button className="dropbtn">•••</button>
                      <div className="dropdown-content">
                        <small>
                          <button
                            className="before"
                            onClick={() => {
                              onInsertPolygon(index, "before");
                              onClose();
                            }}
                          >
                            Insert Polygon Before
                          </button>
                        </small>
                        <small>
                          <button
                            className="after"
                            onClick={() => {
                              onInsertPolygon(index, "after");
                              onClose();
                            }}
                          >
                            Insert Polygon After
                          </button>
                        </small>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default MissionModal;
