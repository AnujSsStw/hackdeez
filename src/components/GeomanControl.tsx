import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

const Geoman = () => {
  const map = useMap();

  map.pm.setLang("en");

  map.pm.setGlobalOptions({
    snapDistance: 15,
    allowSelfIntersection: false,
    templineStyle: { color: "rgba(0, 255, 102, 0.5)" },
    hintlineStyle: { color: "rgba(0, 255, 102, 0.5)", dashArray: [5, 5] },
    pathOptions: { color: "rgba(0, 255, 102, 0.5)" },
  });

  useEffect(() => {
    map.pm.addControls({
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: true,
      drawPolygon: true,
      drawCircle: false,
      drawMarker: false,
      customControls: false,
      rotateMode: false,
      cutPolygon: false,
      editMode: true,
      dragMode: true,
    });
  }, [map]);

  return null;
};

export default Geoman;
