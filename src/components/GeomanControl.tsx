import { useEffect } from "react";
import { useLeafletContext } from "@react-leaflet/core";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { useMap } from "react-leaflet";

const Geoman = () => {
  const map = useMap();

  map.pm.addControls();

  map.pm.setLang("en");

  map.pm.setGlobalOptions({
    snapDistance: 15,
    allowSelfIntersection: false,
    templineStyle: { color: "rgba(0, 255, 102, 0.5)" },
    hintlineStyle: { color: "rgba(0, 255, 102, 0.5)", dashArray: [5, 5] },
    pathOptions: { color: "rgba(0, 255, 102, 0.5)" },
  });

  return null;
};

export default Geoman;
