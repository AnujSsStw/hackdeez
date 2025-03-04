import {
  createStyles,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  Image,
  rem,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  inner: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: 80,
    paddingBottom: 60,
  },

  content: {
    maxWidth: 480,
    marginRight: 60,

    [theme.fn.smallerThan("md")]: {
      maxWidth: "100%",
      marginRight: 0,
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 45,
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan("xs")]: {
      fontSize: 28,
    },
  },

  control: {
    [theme.fn.smallerThan("xs")]: {
      flex: 1,
    },
  },

  image: {
    flex: 1,

    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  highlight: {
    position: "relative",
    backgroundColor: theme.fn.variant({
      variant: "light",
      color: theme.primaryColor,
    }).background,
    borderRadius: theme.radius.sm,
    padding: "4px 12px",
  },
}));

export default function Home() {
  const { classes } = useStyles();
  const router = useRouter();

  return (
    <Container size="md">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            📍<span className={classes.highlight}>MapMates</span> Trip <br />
            Planning Playground
          </Title>
          <Text c="dimmed" mt="md">
            Your go-to platform for seamless collaborative trip planning. Map
            out your adventures, explore places, and connect with friends, all
            in one place.
          </Text>

          <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl">
                <IconCheck
                  style={{ width: rem(12), height: rem(12) }}
                  stroke={1.5}
                />
              </ThemeIcon>
            }
          >
            <List.Item>
              <b>Collaborative</b> – built around interactivity and live updates
            </List.Item>
            <List.Item>
              <b>Explore</b> – all publicily created maps in one place
            </List.Item>
            <List.Item>
              <b>Find places </b> – plan a trip or find a place to eat with your
              friends
            </List.Item>
          </List>

          <Group mt={30}>
            <Button
              radius="xl"
              size="md"
              className={classes.control}
              onClick={() => {
                router.push("/app");
              }}
            >
              Get started
            </Button>
{/*             <Button
              variant="default"
              radius="xl"
              size="md"
              className={classes.control}
              onClick={() => {
                window.open("https://github.com/AnujSsStw/hackdeez", "_blank");
              }}
            >
              Source code
            </Button> */}
          </Group>
        </div>
        <Image src={"/pic1.jpeg"} className={classes.image} />
      </div>
    </Container>
  );
}
