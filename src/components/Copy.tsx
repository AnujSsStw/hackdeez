import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation } from "convex/react";
import Control from "react-leaflet-custom-control";
import { api } from "../../convex/_generated/api";
import { BASE_URL } from "@/util/helper";

const Copy = (props: { mapId: string }) => {
  const createACopy = useMutation(api.map.createACopy);
  return (
    <>
      <Control position="bottomleft">
        <Button
          onClick={async () => {
            const res = await createACopy({ mapId: props.mapId });

            if (res) {
              notifications.show({
                title: "Map Copied",
                message: "Routing to new map",
              });
              window.open(`${BASE_URL}/app/room/${res}`, "_ blank");
            }
          }}
          variant="outline"
          color="orange"
        >
          Copy
        </Button>
      </Control>
    </>
  );
};

export default Copy;
