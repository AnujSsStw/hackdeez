import { HeaderMegaMenu } from "@/components/mantine/Nav";
import { randomColor } from "@/util/helper";
import {
  Box,
  Card,
  Container,
  Overlay,
  rem,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { useQuery } from "convex/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";
import { api } from "../../../convex/_generated/api";

dayjs.extend(relativeTime);

const Explore = () => {
  const getAllMaps = useQuery(api.map.getPublicMaps);

  function handleRoute(id: string) {
    window.open(`http://localhost:3000/app/room/${id}`, "_ blank");
  }

  const cards = getAllMaps?.map((map) => {
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
        </div>
      </Card>
    );
  });
  return (
    <>
      <HeaderMegaMenu />
      <Box mx="auto" my="md" maw={700}>
        <Container py="xl">
          <SimpleGrid cols={3}>{cards}</SimpleGrid>
        </Container>
      </Box>
    </>
  );
};

export default Explore;
