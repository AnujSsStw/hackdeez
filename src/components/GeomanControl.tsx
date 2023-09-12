import "@geoman-io/leaflet-geoman-free";
import L, { geoJSON } from "leaflet";
import Control from "react-leaflet-custom-control";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { use, useEffect, useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { Button } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import { LineString, MultiLineString } from "geojson";

const Geoman = () => {
  const map = useMap();
  const [collection, setCollection] = useState<{
    type: string;
    features: any[];
  }>({
    type: "FeatureCollection",
    features: [],
  });

  map.pm.setLang("en");

  map.pm.setGlobalOptions({
    snapDistance: 15,
    allowSelfIntersection: false,
    templineStyle: { color: "rgba(0, 255, 102, 0.5)" },
    hintlineStyle: { color: "rgba(0, 255, 102, 0.5)", dashArray: [5, 5] },
    pathOptions: { color: "rgba(0, 255, 102, 0.5)" },
  });
  const [isDrawing, setIsDrawing] = useState(false);

  map.on("pm:create", (e) => {
    // @ts-ignore
    var geojson = e.layer.toGeoJSON();

    if (e.shape === "Polygon") {
      console.log("polygon created");
      setCollection({
        type: "FeatureCollection",
        features: [...collection.features, geojson],
      });
    } else if (e.shape === "Line") {
      console.log("line created");
      // @ts-ignore
      // var points = e.layer._latlngs;
      // console.log("points", points);

      setCollection({
        type: "FeatureCollection",
        features: [...collection.features, geojson],
      });
    } else if (e.shape === "Marker") {
      console.log("marker created");
      setCollection({
        type: "FeatureCollection",
        features: [...collection.features, geojson],
      });
    } else if (e.shape === "Text") {
      console.log("text created");
      setCollection({
        type: "FeatureCollection",
        features: [...collection.features, geojson],
      });
    } else {
      console.log("something else created");
    }
  });

  useEffect(() => {
    console.log("collection", collection);
  }, [collection]);

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
  }, []);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      map.pm.disableDraw();
      map.pm.disableGlobalEditMode();
    }
  });

  let paintMode = false;
  let myPolyline: L.Polyline<LineString | MultiLineString, any>;
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
