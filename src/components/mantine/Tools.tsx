import { ColorInput, Flex, Grid } from "@mantine/core";
import L from "leaflet";
import {
  IconArrowUpRightCircle,
  IconEraser,
  IconMapPin,
  IconPencil,
  IconPointerBolt,
  IconShape2,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";

const Tools = () => {
  const map = useMap();
  function handleDrawing() {
    console.log("drawing");
    map.dragging.disable();
  }
  const [myPolyline, setMyPolyline] = useState<any>(null);

  useEffect(() => {
    map.on("click", (e) => {
      setMyPolyline(L.polyline([]).addTo(map));
    });
    map.on("mousemove", (e) => {
      if (myPolyline) {
        myPolyline.addLatLng(e.latlng);
        myPolyline.addTo(map);
      }
    });
  }, [map]);
  return (
    <Grid
      sx={{
        position: "absolute",
        zIndex: 999,
        left: "50%",
        bottom: "10px",
        transform: "translateX(-50%)",
        // glass white
        backgroundColor: "black",
        alignItems: "center",
      }}
      //   justify="center"
      w={"auto"}
    >
      <Grid.Col span={1}>
        <IconPointerBolt onClick={handleDrawing} />
      </Grid.Col>
      <Grid.Col span={1}>
        <IconPencil />
      </Grid.Col>
      <Grid.Col span={1}>
        <IconEraser />
      </Grid.Col>
      <Grid.Col span={1}>
        <IconMapPin />
      </Grid.Col>
      <Grid.Col span={1}>
        <IconArrowUpRightCircle />
      </Grid.Col>
      <Grid.Col span={1}>
        <IconShape2 />
      </Grid.Col>
      <Grid.Col span={4}>
        <ColorInput defaultValue="#C5D899" />
      </Grid.Col>
    </Grid>
  );
};

export default Tools;
