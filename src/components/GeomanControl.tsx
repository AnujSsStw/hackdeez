import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { Box, Button, Dialog, Group, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import { useMutation } from "convex/react";
import { LineString, MultiLineString } from "geojson";
import L from "leaflet";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import { api } from "../../convex/_generated/api";
import { modals } from "@mantine/modals";
import { Id } from "../../convex/_generated/dataModel";

const Geoman = (props: { mapId: string | string[] | undefined }) => {
  const map = useMap();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [collection, setCollection] = useState<{
    type: string;
    features: any;
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
  const featAdd = useMutation(api.map.insertFeat);
  const mapFeatMut = useMutation(api.map.insertFeatToMap);
  const [locationDes, setLocationDes] = useState<string>("");
  const [runUpdate, setRunUpdate] = useState<boolean>(false);

  map.on("pm:create", (e) => {
    // @ts-ignore
    var geojson = e.layer.toGeoJSON();

    if (e.shape === "Polygon") {
      console.log("polygon created");
      toggle();
      setCollection({
        type: "FeatureCollection",
        features: geojson,
      });
    } else if (e.shape === "Line") {
      console.log("line created");
      // @ts-ignore
      // var points = e.layer._latlngs;
      // console.log("points", points);

      setCollection({
        type: "FeatureCollection",
        features: geojson,
      });
    } else if (e.shape === "Marker") {
      console.log("marker created");
      setCollection({
        type: "FeatureCollection",
        features: geojson,
      });
    } else if (e.shape === "Text") {
      console.log("text created");
      setCollection({
        type: "FeatureCollection",
        features: geojson,
      });
    } else {
      console.log("something else created");
    }
  });
  const remveFeat = useMutation(api.map.removeFeatFromMap);

  useEffect(() => {
    console.log("collection", collection);
    if (collection.features.length === 0) return;

    (async () => {
      const featid = await featAdd(collection.features);
      await mapFeatMut({ featId: featid, mapId: props.mapId as string });
    })();
  }, [runUpdate]);

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
      dragMode: false,
    });
    map.on("pm:remove", async (e) => {
      // console.log("pm:remove", e.layer.feature._id);
      if (e.layer.feature?._id === undefined) return;
      await remveFeat({
        featId: e.layer.feature._id as Id<"feat">,
        mapId: props.mapId as string,
      });
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
      } else {
        setCollection({
          type: "FeatureCollection",
          features: [...collection.features, myPolyline.toGeoJSON() as any],
        });
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

  function addInCollection() {
    if (locationDes.length === 0) return;
    console.log("addInCollection");
    setCollection({
      type: "FeatureCollection",
      features: {
        ...collection.features,
        properties: {
          ...collection.features.properties,
          popupContent: locationDes,
        },
      },
    });
    setRunUpdate(!runUpdate);
    close();
  }

  return (
    <>
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

      <Dialog
        opened={opened}
        // withCloseButton
        onClose={close}
        size="lg"
        radius="md"
        zIndex={999999999999}
      >
        <Text size="sm" mb="xs" weight={500}>
          Subscribe to email newsletter
        </Text>

        <Group align="flex-end">
          <TextInput
            onChange={(e) => {
              setLocationDes(e.currentTarget.value);
            }}
            placeholder="hello@gluesticker.com"
            sx={{ flex: 1 }}
            value={locationDes}
          />
          <Button onClick={addInCollection}>Add</Button>
        </Group>
      </Dialog>
    </>
  );
};

export default Geoman;
