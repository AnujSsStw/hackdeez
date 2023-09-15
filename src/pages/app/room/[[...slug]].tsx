import { useStyple2 } from "@/components/mantine/random";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/router";

import Select from "@/components/mantine/Marker";
import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Menu,
  Modal,
  Navbar,
  Text,
  Tooltip,
  rem,
} from "@mantine/core";
import {
  IconArrowsLeftRight,
  IconMessageCircle,
  IconPhoto,
  IconPlus,
  IconSearch,
  IconSettings,
  IconShare,
  IconTrash,
} from "@tabler/icons-react";
import { useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useDisclosure } from "@mantine/hooks";

const Room = () => {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/Map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );
  const router = useRouter();
  const [places, setPlaces] = useState<any>([]);

  const { user } = useUser();
  const { slug } = router.query;

  const geo = useQuery(
    api.map.mapfeat,
    slug !== undefined && user !== undefined
      ? { mapId: slug[0], userId: user!.id }
      : "skip"
  );
  const mapDetails = useQuery(
    api.map.getMap,
    slug !== undefined ? { mapId: slug[0] } : "skip"
  );

  if (!user || !slug) {
    return <div>Loading...</div>;
  }

  return (
    <Flex>
      <NavbarSearch onChange={setPlaces} value={places} d={mapDetails} />
      <Map roomId={slug![0]} userId={user!.id} geojson={geo} places={places} />
    </Flex>
  );
};

const collections = [
  { emoji: "🚚", label: "Deliveries" },
  { emoji: "💸", label: "Discounts" },
  { emoji: "💰", label: "Profits" },
  { emoji: "✨", label: "Reports" },
  { emoji: "🛒", label: "Orders" },
  { emoji: "👍", label: "Sales" },
];

export function NavbarSearch(props: {
  value?: string;
  onChange: (value: any) => void;
  d:
    | {
        _id: Id<"map">;
        _creationTime: number;
        name?: string | undefined;
        des?: string | undefined;
        featIds: Id<"feat">[];
        mapId: string;
        isPublic: boolean;
      }
    | null
    | undefined;
}) {
  const { classes } = useStyple2();

  const collectionLinks = collections.map((collection) => (
    <a className={classes.collectionLink} key={collection.emoji}>
      <span style={{ marginRight: rem(9), fontSize: rem(16) }}>
        {collection.label}
      </span>

      {collection.emoji}
    </a>
  ));
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <Navbar
      height={"100vh"}
      width={{ sm: 300 }}
      p="md"
      className={classes.navbar}
    >
      <Navbar.Section className={classes.section}>
        <Group className={classes.collectionsHeader} position="apart">
          <Flex direction={"column"}>
            <Text
              size="md"
              // weight={500}
              color="dimmed"
              sx={{ fontWeight: "bold" }}
            >
              {props.d?.name}
            </Text>
            <Text size="xs" weight={500} color="dimmed">
              {props.d?.des}
            </Text>
          </Flex>
          <Modal
            opened={opened}
            onClose={close}
            title={"Share " + props.d?.name}
            centered
            zIndex={10000}
          >
            {/* Modal content */}
          </Modal>

          <Group position="center">
            <ActionIcon variant="filled" onClick={open}>
              <IconShare size="1rem" />
            </ActionIcon>
          </Group>
        </Group>
      </Navbar.Section>

      <Select setValue={props.onChange} value={props.value} />
      <Navbar.Section className={classes.section} pb={13}>
        {}
      </Navbar.Section>

      <Navbar.Section className={classes.section}>
        <Group className={classes.collectionsHeader} position="apart">
          <Text size="xs" weight={500} color="dimmed">
            Collections
          </Text>
          <Tooltip label="Create collection" withArrow position="right">
            <ActionIcon variant="default" size={18}>
              <IconPlus size="0.8rem" stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Group>
        <div className={classes.collections}>{collectionLinks}</div>
      </Navbar.Section>
    </Navbar>
  );
}

export default Room;
