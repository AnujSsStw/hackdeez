import { BASE_URL, randomColor } from "@/util/helper";
import { useUser } from "@clerk/clerk-react";
import { Button, Card, Overlay, Text, rem } from "@mantine/core";
import { useMutation, useQuery } from "convex/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { api } from "../../../convex/_generated/api";

dayjs.extend(relativeTime);

export const CardBox = ({ type }: { type: string }) => {
  const { user } = useUser();

  const getUserMaps = useQuery(
    api.map.getAllUserMaps,
    user?.id !== undefined ? { userId: user.id } : "skip"
  );
  const changeType = useMutation(api.map.changeIsPublic);

  function handleRoute(id: string) {
    console.log(BASE_URL);

    window.open(`${BASE_URL}/app/room/${id}`, "_ blank");
  }

  async function handleChangeType(id: string, isPublic: boolean) {
    await changeType({ mapId: id, isPublic: !isPublic });
  }

  const cards = (type: string) =>
    getUserMaps
      ?.filter((map) => {
        if (type === "all") {
          return map;
        } else if (type === "public") {
          return map.isPublic === true;
        }
      })
      ?.map((map) => {
        return (
          <Card
            className="hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out "
            radius="md"
            key={map._id}
            h={rem("200px")}
          >
            <Overlay
              opacity={0.55}
              zIndex={0}
              sx={{
                backgroundColor: "transparent",
                backgroundImage: `linear-gradient(to bottom, ${randomColor()}, ${randomColor()})`,
              }}
            />
            <div className="z-20 absolute w-5/6 bottom-3">
              <Text
                size="lg"
                fw={700}
                color="black"
                onClick={() => handleRoute(map.mapId)}
                className="cursor-pointer"
              >
                {map.name}
              </Text>
              <Text size="sm" c="white">
                {map.des}
              </Text>
              <Text c="dimmed">{dayjs(map._creationTime).fromNow()}</Text>
              <Button
                variant="light"
                color="white"
                fullWidth
                mt="md"
                radius="md"
                onClick={() => handleChangeType(map.mapId, map.isPublic)}
              >
                Make it {map.isPublic ? "Private" : "Public"}
              </Button>
            </div>
          </Card>
        );
      });

  return cards(type);
};
