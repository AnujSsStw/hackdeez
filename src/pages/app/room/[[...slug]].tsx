import { useStyple2 } from "@/components/mantine/random";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/router";

import {
  ActionIcon,
  Badge,
  Code,
  Flex,
  Group,
  Navbar,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
  rem,
} from "@mantine/core";
import {
  IconBulb,
  IconCheckbox,
  IconPlus,
  IconSearch,
  IconUser,
} from "@tabler/icons-react";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Foo from "@/components/val";

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

  const { user } = useUser();
  const { slug } = router.query;

  const geo = useQuery(
    api.map.mapfeat,
    slug !== undefined && user !== undefined
      ? { mapId: slug[0], userId: user!.id }
      : "skip"
  );
  const geoMut = useMutation(api.map.insertMap);

  if (!user || !slug) {
    return <div>Loading...</div>;
  }

  console.log(geo);
  if (geo?.length === 0) {
    (async () => {
      await geoMut({
        mapId: slug![0],
      });
    })();
  }

  // const geo = undefined;

  return (
    <Flex>
      <NavbarSearch />
      <Map roomId={slug![0]} userId={user!.id} geojson={geo} />
    </Flex>
  );
};

const links = [
  { icon: IconBulb, label: "Activity", notifications: 3 },
  { icon: IconCheckbox, label: "Tasks", notifications: 4 },
  { icon: IconUser, label: "Contacts" },
];

const collections = [
  { emoji: "🚚", label: "Deliveries" },
  { emoji: "💸", label: "Discounts" },
  { emoji: "💰", label: "Profits" },
  { emoji: "✨", label: "Reports" },
  { emoji: "🛒", label: "Orders" },
  { emoji: "👍", label: "Sales" },
];

export function NavbarSearch() {
  const { classes } = useStyple2();

  const mainLinks = links.map((link) => (
    <UnstyledButton key={link.label} className={classes.mainLink}>
      <div className={classes.mainLinkInner}>
        <link.icon size={20} className={classes.mainLinkIcon} stroke={1.5} />
        <span>{link.label}</span>
      </div>
      {link.notifications && (
        <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
          {link.notifications}
        </Badge>
      )}
    </UnstyledButton>
  ));

  const collectionLinks = collections.map((collection) => (
    // <Foo
    //   key={collection.label}
    //   emoji={collection.emoji}
    //   label={collection.label}
    //   classs={classes.collectionLink}
    // />
    <a className={classes.collectionLink} key={collection.emoji}>
      <span style={{ marginRight: rem(9), fontSize: rem(16) }}>
        {collection.label}
      </span>

      {collection.emoji}
    </a>
  ));

  return (
    <Navbar
      height={"100vh"}
      width={{ sm: 300 }}
      p="md"
      className={classes.navbar}
    >
      <Navbar.Section className={classes.section}>
        {/* <UserButton
          image="https://i.imgur.com/fGxgcDF.png"
          name="Bob Rulebreaker"
          email="Product owner"
          icon={<IconSelector size="0.9rem" stroke={1.5} />}
        /> */}
        Me
      </Navbar.Section>

      <TextInput
        placeholder="Search"
        size="xs"
        icon={<IconSearch size="0.8rem" stroke={1.5} />}
        rightSectionWidth={70}
        rightSection={<Code className={classes.searchCode}>Ctrl + K</Code>}
        styles={{ rightSection: { pointerEvents: "none" } }}
        mb="sm"
      />

      <Navbar.Section className={classes.section}>
        <div className={classes.mainLinks}>{mainLinks}</div>
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
