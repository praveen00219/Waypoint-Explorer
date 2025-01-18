import React from "react";
import { calculateDistance } from "../utils/geoUtils";
import { MdClose } from "react-icons/md";

function PolygonModal({ coordinates, onClose, onImport }) {
  const flatCoordinates = coordinates[0]; // Polygon coordinates are nested
  console.log("coordinates", coordinates);
  return (
    <>
      {coordinates.length !== 0 && (
        <div className="modal1 polygon-modal">
          <div className="mb-3 d-flex align-items-center justify-content-between">
            <h5 className="m-0 p-0">Polygon Coordinates</h5>
            <button
              className="close-btn border-0 px-3 py-1 bg-light"
              onClick={onClose}
            >
              <MdClose className="close-btn-icon" />
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Point</th>
                <th>Coordinates</th>
                <th>Distance (m)</th>
              </tr>
            </thead>
            <tbody>
              {flatCoordinates?.map((coord, index) => (
                <tr key={index}>
                  <td>P{index + 1}</td>
                  <td>
                    {`${coord[0].toFixed(8)}° N`}, {`${coord[1].toFixed(8)}° S`}
                  </td>
                  <td>
                    {index > 0
                      ? calculateDistance(flatCoordinates[index - 1], coord)
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 d-flex align-items-center justify-content-end">
            <button
              className=" border rounded px-3 py-1 bg-light"
              onClick={onImport}
            >
              Import Points
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default PolygonModal;
