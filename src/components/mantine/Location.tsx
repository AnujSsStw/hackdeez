import { ActionIcon, Box } from "@mantine/core";
import { IconCurrentLocation, IconLocationBolt } from "@tabler/icons-react";
import {
  IconAdjustments,
  IconLocation,
  IconLocationPlus,
} from "@tabler/icons-react";
import L from "leaflet";
import { useMap } from "react-leaflet";

const LiveLocationButton = (props: {
  fn: () => void;
  userlocation: L.Marker<any> | undefined;
}) => {
  const map = useMap();
  function targetLiveLocation() {
    // stopObserving();

    if (navigator.geolocation) {
      if (props.userlocation !== undefined) {
        navigator.geolocation.getCurrentPosition(function (position) {
          props.userlocation!.setLatLng([
            position.coords.latitude,
            position.coords.longitude,
          ]);

          map.flyTo(props.userlocation!.getLatLng(), 18);
        });
      } else {
        // If the location is unknown, set it and fly there
        props.fn();
        targetLiveLocation();
      }
    }
  }

  return (
    <Box
      sx={{
        position: "absolute",
        zIndex: 999,
        // padding: "10px",
        bottom: "20px",
        right: "20px",
        border: "1px solid #ccc",
        borderRadius: "50%",
      }}
    >
      <ActionIcon color="grape" size="lg" variant="filled">
        <IconCurrentLocation size="1.625rem" onClick={targetLiveLocation} />
      </ActionIcon>
    </Box>
  );
};

export default LiveLocationButton;
