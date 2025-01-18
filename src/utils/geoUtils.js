import { LineString } from "ol/geom";
import { getArea, getLength } from "ol/sphere";

export const formatLength = (line) => {
  // console.log("line", line);
  const length = getLength(line);
  return length > 100 ? `${length.toFixed(2)} m` : `${length.toFixed(2)} m`;
};

export const formatArea = (polygon) => {
  const area = getArea(polygon);
  return area > 10000
    ? `${(area / 1000000).toFixed(2)} km²`
    : `${area.toFixed(2)} m²`;
};

export function calculateDistance(coord1, coord2) {
  const segment = new LineString([coord1, coord2]);
  return formatLength(segment);
}
