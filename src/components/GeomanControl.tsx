import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import {
  Box,
  Button,
  ColorPicker,
  Dialog,
  Group,
  Menu,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconColorSwatch,
  IconPencil,
  IconPencilBolt,
} from "@tabler/icons-react";
import * as turf from "@turf/turf";
import { useMutation } from "convex/react";
import { LineString, MultiLineString } from "geojson";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { use, useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import "leaflet-simple-map-screenshoter";

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

  const [isDrawing, setIsDrawing] = useState(false);
  const featAdd = useMutation(api.map.insertFeat);
  const mapFeatMut = useMutation(api.map.insertFeatToMap);
  const [locationDes, setLocationDes] = useState<string>("");
  const [runUpdate, setRunUpdate] = useState<boolean>(false);

  const remveFeat = useMutation(api.map.removeFeatFromMap);
  const [color, onChange] = useState("rgba(47, 119, 150, 0.7)");

  useEffect(() => {
    console.log("collection", collection);
    if (collection.features.length === 0) return;

    (async () => {
      const featid = await featAdd(collection.features);
      await mapFeatMut({ featId: featid, mapId: props.mapId as string });
    })();
  }, [runUpdate]);

  useEffect(() => {
    console.log("collection", collection);
    if (collection.features.length === 0) return;
    if (collection.type === "drawing") {
      (async () => {
        const featid = await featAdd(collection.features);
        await mapFeatMut({ featId: featid, mapId: props.mapId as string });
      })();
    }
  }, [collection]);
  // useEffect(() => {
  //   if (map.hasLayer(L.simpleMapScreenshoter() as any)) {
  //     map.removeLayer(L.simpleMapScreenshoter() as any);
  //   }
  //   L.simpleMapScreenshoter().addTo(map);
  // }, []);

  useEffect(() => {
    map.pm.setLang("en");

    map.pm.setGlobalOptions({
      snapDistance: 15,
      allowSelfIntersection: false,
      templineStyle: { color: "rgba(0, 255, 102, 0.5)" },
      hintlineStyle: { color: "rgba(0, 255, 102, 0.5)", dashArray: [5, 5] },
      pathOptions: { color: "rgba(0, 255, 102, 0.5)" },
      markerStyle: {
        icon: L.icon({
          iconUrl: "/assets/marker.svg",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [-3, -76],
        }),
        draggable: false,
      },
    });

    map.pm.addControls({
      position: "topright",
      drawControls: true,
      editControls: true,
      optionsControls: true,
      drawRectangle: false,
      drawCircleMarker: false,
      drawCircle: false,
      cutPolygon: false,
      rotateMode: false,
      editMode: false,
      dragMode: false,
      drawText: false,
    });

    map.on("pm:create", (e) => {
      // @ts-ignore
      const geojson = e.layer.toGeoJSON();

      if (e.shape === "Polygon") {
        const area = parseFloat((turf.area(geojson) * 0.000001).toFixed(2));
        console.log("polygon created area", area);

        toggle();
        setCollection({
          type: "FeatureCollection",
          features: geojson,
        });
      } else if (e.shape === "Line") {
        const something = parseFloat(
          turf.length(geojson, { units: "miles" }).toFixed(2)
        );
        console.log("line created len", something);

        toggle();
        setCollection({
          type: "FeatureCollection",
          features: geojson,
        });
      } else if (e.shape === "Marker") {
        console.log("marker created");
        map.pm.disableDraw();
        toggle();
        setCollection({
          type: "FeatureCollection",
          features: geojson,
        });
      } else if (e.shape === "Text") {
        console.log("text created");
        // toggle();
        // setCollection({
        //   type: "FeatureCollection",
        //   features: geojson,
        // });
      } else {
        console.log("something else created");
      }
    });

    map.on("pm:remove", async (e) => {
      // @ts-ignore
      if (e.layer.feature?._id === undefined) return;
      await remveFeat({
        // @ts-ignore
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

  useEffect(() => {
    let paintMode = false;
    let myPolyline: L.Polyline<LineString | MultiLineString, any>;
    if (isDrawing) {
      map.on("click", function () {
        paintMode = !paintMode;
        if (paintMode) {
          // add a marker of pencil
          myPolyline = L.polyline([], {
            color: color,
            weight: 3,
            smoothFactor: 1,
          }).addTo(map);
        } else {
          setCollection({
            type: "drawing",
            features: {
              ...myPolyline.toGeoJSON(),
              style: { color: color },
            } as any,
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
  }, [isDrawing]);

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
    setLocationDes("");
    setRunUpdate(!runUpdate);
    close();
  }

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          zIndex: 999,
          top: "158px",
          right: "12px",
          width: "32px",
          height: "32px",
        }}
      >
        <Box
          sx={{
            background: "white",
            boxShadow: "5px",
            paddingLeft: "0px",
            width: "inherit",
            height: "inherit",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "2px",
            cursor: "pointer",
            marginBottom: "12px",
          }}
          className="leaflet-touch leaflet-control-layers leaflet-touch leaflet-bar"
          onClick={() => {
            setIsDrawing(!isDrawing);
          }}
        >
          {isDrawing ? <IconPencilBolt /> : <IconPencil />}
        </Box>
        <Menu position="left">
          <Menu.Target>
            <Box
              sx={{
                background: color,
                boxShadow: "5px",
                paddingLeft: "0px",
                width: "inherit",
                height: "inherit",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              className="leaflet-touch leaflet-touch leaflet-bar"
            >
              <IconColorSwatch />
            </Box>
          </Menu.Target>
          <Menu.Dropdown sx={{ zIndex: 9999999999 }}>
            <Menu.Item sx={{ zIndex: 9999999999 }}>
              <ColorPicker
                value={color}
                onChange={onChange}
                sx={{ zIndex: 9999999999 }}
              />
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Box>

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
