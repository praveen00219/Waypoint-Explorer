import React, { useRef, useEffect } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { Draw } from "ol/interaction";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { LineString } from "ol/geom";
import { Feature } from "ol";
import { Stroke, Style, Icon, Circle, Fill } from "ol/style";
import Point from "ol/geom/Point";
import { FaRegFolderClosed } from "react-icons/fa6";
import MultiPoint from "ol/geom/MultiPoint";

const imgSrc =
  "http://pluspng.com/img-png/right-arrow-png-arrow-png-image-40020-6304.png";

function MapComponent({ children, drawType, onDrawComplete }) {
  const mapRef = useRef();
  const mapInstance = useRef(null);
  const drawInteraction = useRef(null);
  const vectorSource = useRef(new VectorSource());
  console.log("vectorSource", vectorSource);
  const vectorLayer = useRef(null);

  const styles = [
    /* We are using two different styles for the polygons:
     *  - The first style is for the polygons themselves.
     *  - The second style is to draw the vertices of the polygons.
     *    In a custom `geometry` function the vertices of a polygon are
     *    returned as `MultiPoint` geometry, which will be used to render
     *    the style.
     */
    // new Style({
    //   stroke: new Stroke({
    //     color: "blue",
    //     width: 3,
    //   }),
    //   fill: new Fill({
    //     color: "rgba(0, 0, 255, 0.1)",
    //   }),
    // }),
    new Style({
      image: new Circle({
        radius: 5,
        fill: new Fill({
          color: "orange",
        }),
      }),
      geometry: function (feature) {
        // return the coordinates of the first ring of the polygon
        const coordinates = feature.getGeometry().getCoordinates()[0];
        return new MultiPoint(coordinates);
      },
    }),
  ];

  useEffect(() => {
    vectorLayer.current = new VectorLayer({
      source: vectorSource.current,
      style: styles,
    });
  }, [vectorSource]);

  useEffect(() => {
    mapInstance.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer.current,
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
        line: "red",
      }),
    });

    return () => mapInstance.current.setTarget(undefined);
  }, [vectorLayer]);

  console.log("mapInstance-----", mapInstance.current);

  useEffect(() => {
    // console.log("drawInteraction -------------", drawInteraction);
    // console.log("mapInstance -------------", drawType, mapInstance);
    if (drawType) {
      if (drawInteraction.current) {
        mapInstance.current.removeInteraction(drawInteraction.current);
      }

      drawInteraction.current = new Draw({
        source: vectorSource.current,
        type: drawType,
      });
      const styles = [
        // linestring
        new Style({
          stroke: new Stroke({
            color: "black",
            width: 4,
          }),
        }),
      ];

      drawInteraction.current.on("drawend", (event) => {
        const feature = event.feature;
        const geometry = feature.getGeometry();

        geometry.forEachSegment(function (start, end) {
          const dx = end[0] - start[0];
          const dy = end[1] - start[1];
          const rotation = Math.atan2(dy, dx);
          console.log("start, end", start, end);
          // arrows
          styles.push(
            new Style({
              geometry: new Point(start, end),
              image: new Icon({
                src: imgSrc,
                anchor: [0.75, 0.5],
                rotateWithView: true,
                rotation: -rotation,
              }),
            })
          );
        });

        const coordinates = geometry.getCoordinates();
        onDrawComplete(coordinates, drawType);
        // console.log("geometry ----> ", geometry);
      });

      vectorLayer.current.setStyle(styles);

      mapInstance.current.addInteraction(drawInteraction.current);
    } else if (drawInteraction.current) {
      mapInstance.current.removeInteraction(drawInteraction.current);
    }
  }, [drawType, onDrawComplete, vectorLayer]);

  return (
    <div ref={mapRef} className="map-container">
      {children}
    </div>
  );
}

export default MapComponent;
