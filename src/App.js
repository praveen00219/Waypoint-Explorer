import React, { useState } from "react";
import Map from "./components/Map";
import MissionModal from "./components/MissionModal";
import PolygonModal from "./components/PolygonModal";
import DrawControl from "./components/DrawControl";
import "./App.css";
import MeasureMap from "./components/NewMap";

function App() {
  const [waypoints, setWaypoints] = useState([]);
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [showPolygonModal, setShowPolygonModal] = useState(false);
  const [drawType, setDrawType] = useState("LineString");

  const handleDrawComplete = (coordinates, type) => {
    // console.log({ coordinates, type });
    if (type === "LineString") {
      setWaypoints(coordinates);
      setShowMissionModal(true);
    } else if (type === "Polygon") {
      setPolygonCoordinates(coordinates);
      setShowPolygonModal(true);
    }
    // setDrawType(null);
  };

  const handleDrawButtonClick = (drawType) => {
    if (drawType === "LineString") {
      setDrawType("LineString");
      setShowMissionModal(true);
    } else if (drawType === "Polygon") {
      setDrawType("Polygon");
      setShowPolygonModal(true);
    }
  };

  const handleInsertPolygon = (index, position) => {
    setDrawType("Polygon");
    // Logic to insert polygon coordinates into waypoints will be implemented here
  };

  return (
    <div className="app">
      <MeasureMap
        setDrawType={setDrawType}
        drawType={drawType}
        onDrawComplete={handleDrawComplete}
      >
        {({ enableDrawing }) => (
          <DrawControl
            enableDrawing={enableDrawing}
            drawType={drawType}
            onDrawButtonClick={handleDrawButtonClick}
          />
        )}
      </MeasureMap>
      {showMissionModal && (
        <MissionModal
          waypoints={waypoints}
          onClose={() => setShowMissionModal(false)}
          onInsertPolygon={handleInsertPolygon}
        />
      )}
      {showPolygonModal && (
        <PolygonModal
          coordinates={polygonCoordinates}
          onClose={() => setShowPolygonModal(false)}
          onImport={() => {
            // Logic to import polygon points into mission planner
            setShowPolygonModal(false);
            setShowMissionModal(true);
          }}
        />
      )}
    </div>
  );
}

export default App;
