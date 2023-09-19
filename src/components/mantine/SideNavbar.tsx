import Select from "@/components/mantine/Marker";
import {
  Accordion,
  ActionIcon,
  Badge,
  Button,
  CopyButton,
  Flex,
  Group,
  Modal,
  NativeSelect,
  Navbar,
  ScrollArea,
  Text,
  TextInput,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconChevronDown,
  IconLink,
  IconMapPin,
  IconPolygon,
  IconRoute,
  IconShare,
} from "@tabler/icons-react";
import { useAction, useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Data } from "../Map";
import Messages from "./Messages";
import { useStyple2 } from "./random";
import { useMap } from "react-leaflet";
import { BASE_URL } from "@/util/helper";

export function NavbarSearch(props: {
  isCreator: boolean;
  col:
    | ({
        _id: Id<"feat">;
        _creationTime: number;
        style?: any;
        type: string;
        geometry: any;
        properties: any;
      } | null)[]
    | undefined;
  link: string;
  value?: string;
  onChange: (value: any) => void;
  d: Data["mapDetails"];
  mapRef: any;
}) {
  const { classes } = useStyple2();
  const theme = useMantineTheme();
  const [value, setValue] = useState(
    !props.d?.anyOneWithLink ? "Restricted" : "Can edit"
  );
  const performMyAction = useAction(api.sendEmail.sendMail);
  const updateAccess = useMutation(api.map.updateMapAccess);
  const [email, setEmail] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  // const map = useMap();

  if (!props.col) {
    return <div>Loading...</div>;
  }

  const getColor = (color: string) =>
    theme.colors[color][theme.colorScheme === "dark" ? 5 : 7];

  const collectionLinks = props.col.map((collection) => (
    <Accordion.Item value={collection?._id!} key={collection?._id}>
      <Accordion.Control
        icon={
          collection?.properties.iconLable === "IconMapPin" ? (
            <IconMapPin size={rem(20)} color={getColor("red")} />
          ) : collection?.properties.iconLable === "IconRoute" ? (
            <IconRoute size={rem(20)} color={getColor("blue")} />
          ) : collection?.properties.iconLable === "IconPolygon" ? (
            <IconPolygon size={rem(20)} color={getColor("violet")} />
          ) : (
            <IconMapPin size="1rem" />
          )
        }
      >
        {collection?.properties.popupContent}
      </Accordion.Control>
      <Accordion.Panel>
        <div
          onClick={() => {
            handleAccord(collection?.geometry);
          }}
          className="cursor-pointer"
        >
          {collection?.geometry.type !== "Point" ? (
            <Flex gap={4}>
              <Badge color="indigo">{collection?.properties.area} sq mi</Badge>
              <Badge color="indigo">{collection?.properties.p} mi</Badge>
            </Flex>
          ) : (
            <Flex gap={2}>
              <Text c="dimmed" size={"sm"}>
                Coordinates
              </Text>
              <Badge color="indigo">
                {collection?.geometry.coordinates[1]}
              </Badge>
              <Badge color="indigo">
                {collection?.geometry.coordinates[0]}
              </Badge>
            </Flex>
          )}
        </div>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  async function handleD() {
    // make restricted to true is value is restricted

    if (value === "Restricted") {
      await updateAccess({
        anyOneWithLInk: false,
        mapId: props.d?.mapId as string,
      });
    } else if (value === "Can edit") {
      await updateAccess({
        anyOneWithLInk: true,
        mapId: props.d?.mapId as string,
      });
    }
    close();
  }
  async function handleEmailInvite() {
    await performMyAction({
      email: email,
      link: BASE_URL + props.link,
    });

    notifications.show({
      title: "Email Send",
      message: "Email send Successfully🤥",
    });
  }
  function handleAccord(geometry: { type: string; coordinates: any[] }) {
    if (geometry.type === "Point") {
      props.mapRef.flyTo(
        [geometry.coordinates[1], geometry.coordinates[0]],
        13
      );
    } else if (geometry.type === "Polygon") {
      props.mapRef.flyTo(
        [geometry.coordinates[0][0][1], geometry.coordinates[0][0][0]],
        13
      );
    } else if (geometry.type === "LineString") {
      props.mapRef.flyTo(
        [geometry.coordinates[0][1], geometry.coordinates[0][0]],
        13
      );
    }
  }

  return (
    <Navbar
      height={"100vh"}
      width={{ sm: 500, md: 400, lg: 300 }}
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
            <Group>
              <TextInput
                placeholder="your@email.com"
                sx={{ width: "283px" }}
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
              />

              <Button variant="outline" onClick={handleEmailInvite}>
                Send invite
              </Button>
            </Group>

            <Group py={3} position="apart">
              <Flex align={"center"} gap={4}>
                <IconLink size="1rem" />
                <Text>Anyone with the link</Text>
              </Flex>
              <NativeSelect
                value={value}
                onChange={(event) => setValue(event.currentTarget.value)}
                placeholder="Your favorite library/framework"
                data={["Can edit", "Restricted"]}
                rightSection={<IconChevronDown size="1rem" />}
                rightSectionWidth={40}
                variant="filled"
              />
            </Group>

            <Group position="apart" mt={10}>
              <CopyButton value={BASE_URL + props.link}>
                {({ copied, copy }) => (
                  <Button
                    color={copied ? "teal" : "blue"}
                    onClick={copy}
                    variant="outline"
                  >
                    {copied ? "Copied url" : "Copy url"}
                  </Button>
                )}
              </CopyButton>
              <Button variant="outline" onClick={handleD}>
                Done
              </Button>
            </Group>
          </Modal>

          <Group position="center">
            <ActionIcon
              onClick={open}
              color="orange"
              variant="outline"
              disabled={!props.isCreator || props.d?.isPublic}
            >
              <IconShare size="1rem" />
            </ActionIcon>
          </Group>
        </Group>
      </Navbar.Section>

      <Select setValue={props.onChange} value={props.value} />
      <Navbar.Section className={classes.section} pb={13}>
        {}
      </Navbar.Section>

      <Navbar.Section className={classes.section} component={ScrollArea} grow>
        <Group className={classes.collectionsHeader}>
          <Text size="xs" weight={500} color="dimmed">
            Collections
          </Text>
        </Group>
        <Accordion variant="default" multiple={true}>
          {collectionLinks}
        </Accordion>
      </Navbar.Section>

      <Messages />
    </Navbar>
  );
}
