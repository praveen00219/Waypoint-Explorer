import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import { OSM, Vector as VectorSource } from "ol/source";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { Draw, Modify } from "ol/interaction";
import { LineString, Point } from "ol/geom";
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from "ol/style";
import { formatArea, formatLength } from "../utils/geoUtils";

const MeasureMap = ({ children, drawType, setDrawType, onDrawComplete }) => {
  const mapRef = useRef();
  const sourceRef = useRef(new VectorSource());
  const modifyRef = useRef();
  const drawRef = useRef();

  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
  const [showSegments, setShowSegments] = useState(true);
  const [clearPrevious, setClearPrevious] = useState(false);

  const styleFunction = (feature, showSegments, drawType) => {
    const styles = [];
    const geometry = feature.getGeometry();
    const type = geometry.getType();
    let point, label, line;

    if (!drawType || drawType === type || type === "Point") {
      styles.push(
        new Style({
          fill: new Fill({ color: "rgba(255, 255, 255, 0.2)" }),
          stroke: new Stroke({ color: "rgba(0, 0, 0, 0.5)", width: 2 }),
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({ color: "white" }),
          }),
        })
      );

      if (type === "Polygon") {
        point = geometry.getInteriorPoint();
        label = formatArea(geometry);
        line = new LineString(geometry.getCoordinates()[0]);
      } else if (type === "LineString") {
        point = new Point(geometry.getLastCoordinate());
        label = formatLength(geometry);
        line = geometry;
      }
    }

    if (showSegments && line) {
      line.forEachSegment((a, b) => {
        const segment = new LineString([a, b]);
        const segmentPoint = new Point(segment.getCoordinateAt(0.5));

        styles.push(
          new Style({
            text: new Text({
              text: formatLength(segment),
              font: "12px Calibri,sans-serif",
              fill: new Fill({ color: "white" }),
              stroke: new Stroke({ color: "black", width: 1 }),
            }),
            geometry: segmentPoint,
          })
        );
      });
    }

    if (label) {
      styles.push(
        new Style({
          text: new Text({
            text: label,
            font: "14px Calibri,sans-serif",
            fill: new Fill({ color: "white" }),
            backgroundFill: new Fill({ color: "black" }),
            padding: [3, 3, 3, 3],
          }),
          geometry: point,
        })
      );
    }

    return styles;
  };

  useEffect(() => {
    const raster = new TileLayer({
      source: new OSM(),
    });

    const vector = new VectorLayer({
      source: sourceRef.current,
      style: (feature) => styleFunction(feature, showSegments, drawType),
    });

    modifyRef.current = new Modify({
      source: sourceRef.current,
    });

    const map = new Map({
      target: mapRef.current,
      layers: [raster, vector],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    map.addInteraction(modifyRef.current);

    const addDrawInteraction = () => {
      if (drawRef.current) {
        map.removeInteraction(drawRef.current);
      }

      drawRef.current = new Draw({
        source: sourceRef.current,
        type: drawType,
        style: (feature) => styleFunction(feature, showSegments, drawType),
      });

      drawRef.current.on("drawstart", () => {
        if (clearPrevious) {
          sourceRef.current.clear();
        }
        modifyRef.current.setActive(false);
      });

      drawRef.current.on("drawend", (event) => {
        const feature = event.feature;
        const geometry = feature.getGeometry();
        const coordinates = geometry.getCoordinates();

        onDrawComplete(coordinates, drawType);

        modifyRef.current.setActive(true);
        setIsDrawingEnabled(false); // Disable drawing after completion
      });

      map.addInteraction(drawRef.current);
    };

    if (isDrawingEnabled) {
      addDrawInteraction();
    }

    return () => {
      map.setTarget(null);
    };
  }, [drawType, showSegments, clearPrevious, isDrawingEnabled]);

  return (
    <div style={{ position: "relative" }}>
      {/* Control Panel */}
      <div className="control-panel">
        {children({
          enableDrawing: () => setIsDrawingEnabled(true),
        })}
        <label>
          Draw Type:
          <select
            value={drawType}
            className="border px-2 py-1 rounded"
            onChange={(e) => setDrawType(e.target.value)}
          >
            <option value="LineString">LineString</option>
            <option value="Polygon">Polygon</option>
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            checked={showSegments}
            onChange={(e) => setShowSegments(e.target.checked)}
          />
          Show Segments
        </label>
        <label>
          <input
            type="checkbox"
            checked={clearPrevious}
            onChange={(e) => setClearPrevious(e.target.checked)}
          />
          Clear Previous
        </label>
      </div>

      {/* Map Container */}
      <div ref={mapRef} className="map-container"></div>
    </div>
  );
};

export default MeasureMap;
