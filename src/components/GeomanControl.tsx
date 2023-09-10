import "@geoman-io/leaflet-geoman-free";
import L, { geoJSON } from "leaflet";
import Control from "react-leaflet-custom-control";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { Button } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import { LineString, MultiLineString } from "geojson";

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
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    map.pm.addControls({
      position: "topright",
      drawControls: true,
      editControls: true,
      optionsControls: true,
      customControls: true,
      drawRectangle: false,
      drawCircleMarker: false,
      drawCircle: false,
      cutPolygon: false,
      rotateMode: false,
      editMode: false,
    });

    map.on("pm:create", (e) => {
      if (e.shape === "Polygon") {
        console.log("polygon created");
      } else if (e.shape === "Line") {
        console.log("line created");
        // here you got the polygon points
        // @ts-ignore
        var points = e.layer._latlngs;
        console.log("points", points);

        // here you can get it in geojson format
        // @ts-ignore
        var geojson = e.layer.toGeoJSON();
        console.log("geojson", geojson);
      } else if (e.shape === "Marker") {
        console.log("marker created");
      } else if (e.shape === "Text") {
        console.log("text created");
      } else {
        console.log("something else created");
      }
    });
  }, []);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      map.pm.disableDraw();
      map.pm.disableGlobalEditMode();
    }
  });

  let paintMode = false;
  var myPolyline: L.Polyline<LineString | MultiLineString, any>;
  if (isDrawing) {
    map.on("click", function () {
      paintMode = !paintMode;
      if (paintMode) {
        myPolyline = L.polyline([], {
          color: "red",
          weight: 3,
          smoothFactor: 1,
        }).addTo(map);
      }
    });

    map.on("mousemove", function (e) {
      if (paintMode) {
        myPolyline.addLatLng(e.latlng);
      }
    });
  } else {
    console.log("drawing is off");

    map.off("click");
    map.off("mousemove");
    paintMode = false;
  }

  return (
    <Control position="topright">
      <Button
        color="inherit"
        onClick={() => {
          setIsDrawing(!isDrawing);
        }}
        sx={{
          border: "1px solid black",
        }}
      >
        <IconPencil />
      </Button>
    </Control>
  );
};

export default Geoman;
