import { useStyple2 } from "@/components/mantine/random";
import { useUser } from "@clerk/clerk-react";
import { IconMapPin, IconPolygon, IconRoute } from "@tabler/icons-react";
import { useRouter } from "next/router";

import { Data } from "@/components/Map";
import { NotFoundTitle } from "@/components/mantine/Error";
import Select from "@/components/mantine/Marker";
import Messages from "@/components/mantine/Messages";
import {
  Accordion,
  ActionIcon,
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
import { IconChevronDown, IconLink, IconShare } from "@tabler/icons-react";
import { useAction, useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

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
  const [toolControl, setToolControl] = useState(false);

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

  useEffect(() => {
    if (!mapDetails) return;

    if (!mapDetails.isPublic) {
      for (let i = 0; i < mapDetails.sendInvite.canEdit.length; i++) {
        if (
          mapDetails.sendInvite.canEdit[i] ===
          user?.emailAddresses[0].emailAddress
        ) {
          setToolControl(true);
          break;
        }
      }

      if (mapDetails.anyOneWithLink) {
        setToolControl(true);
      }
    } else if (mapDetails.isPublic) {
      setToolControl(false);
    }

    if (mapDetails.creator === user?.id) {
      console.log("creator");
      setToolControl(true);
    }
  }, [mapDetails?.anyOneWithLink]);

  if (!user || !slug || !mapDetails) {
    return <NotFoundTitle />;
  } else if (
    user.id !== mapDetails.creator &&
    slug &&
    mapDetails &&
    mapDetails.anyOneWithLink === false &&
    mapDetails.isPublic === false
  ) {
    return <div>Not for you bro</div>;
  }

  return (
    <Flex>
      <NavbarSearch
        onChange={setPlaces}
        value={places}
        d={mapDetails}
        col={geo}
        link={router.asPath}
        isCreator={mapDetails.creator === user.id}
      />
      <Map
        roomId={slug![0]}
        userId={user!.id}
        geojson={geo}
        profilePic={user.imageUrl}
        userName={user.firstName as string}
        places={places}
        mapDetails={mapDetails}
        toolControl={toolControl}
      />
    </Flex>
  );
};

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
}) {
  const { classes } = useStyple2();
  const theme = useMantineTheme();
  const [value, setValue] = useState(
    !props.d?.anyOneWithLink ? "Restricted" : "Can edit"
  );
  const performMyAction = useAction(api.sendEmail.sendMail);
  const updateAccess = useMutation(api.map.updateMapAccess);
  const [email, setEmail] = useState("");

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
      <Accordion.Panel onClick={handleAccord}>
        <div>
          {collection?.properties.area && (
            <Text size="xs" weight={500} color="dimmed">
              {collection?.properties.area} sq mi
            </Text>
          )}
        </div>
      </Accordion.Panel>
    </Accordion.Item>
  ));
  const [opened, { open, close }] = useDisclosure(false);

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
      link: "http://localhost:3000" + props.link,
    });

    notifications.show({
      title: "Email Send",
      message: "Email send Successfully🤥",
    });
  }
  function handleAccord() {
    console.log("clicked");
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
              <CopyButton value={"http://localhost:3000" + props.link}>
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

export default Room;
