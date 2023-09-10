import { ActionIcon, Box } from "@mantine/core";
import { IconCurrentLocation } from "@tabler/icons-react";
import L from "leaflet";
import { useMap, useMapEvents } from "react-leaflet";

const LiveLocationButton = (props: {
  // fn: () => void;
  // userlocation: L.Marker<any> | undefined;
}) => {
  const map = useMap();

  function targetLiveLocation() {
    // stopObserving();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        map.flyTo([position.coords.latitude, position.coords.longitude], 18);
      });
    }
  }

  return (
    <Box
      sx={{
        position: "absolute",
        zIndex: 999,
        bottom: "100px",
        right: "10px",
        border: "1px solid #ccc",
        borderRadius: "50%",
      }}
      onClick={targetLiveLocation}
    >
      <ActionIcon color="grape" size="lg" variant="filled">
        <IconCurrentLocation size="1.625rem" />
      </ActionIcon>
    </Box>
  );
};

export default LiveLocationButton;
