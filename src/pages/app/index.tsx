import Image from "next/image";
import { Inter } from "next/font/google";
import { UserButton } from "@clerk/nextjs";
import { HeaderMegaMenu } from "@/components/mantine/Nav";
import {
  Box,
  BackgroundImage,
  Center,
  Text,
  Button,
  Paper,
  Divider,
  Tabs,
} from "@mantine/core";
import Link from "next/link";
import {
  IconMessageCircle,
  IconPhoto,
  IconPlus,
  IconSettings,
} from "@tabler/icons-react";

const inter = Inter({ subsets: ["latin"] });

export default function App() {
  function handleCreatePlan() {
    alert("Create Plan");
  }

  return (
    <>
      <HeaderMegaMenu />
      <Box mx="auto">
        <Box
          p="md"
          maw={700}
          display={"flex"}
          sx={{ alignItems: "center" }}
          mx={"auto"}
        >
          <Text
            size={"lg"}
            sx={{
              fontWeight: 700,
            }}
          >
            My Plans
          </Text>
          <Button
            variant="outline"
            color="orange"
            ml={"auto"}
            leftIcon={<IconPlus />}
          >
            <Link href="/app/create">Create Plan</Link>
          </Button>
        </Box>
      </Box>

      <Box mx="auto" my="md" maw={700}>
        <Tabs defaultValue="all">
          <Tabs.List position="left">
            <Tabs.Tab value="all" icon={<IconPhoto size="0.8rem" />}>
              All
            </Tabs.Tab>
            <Tabs.Tab value="public" icon={<IconMessageCircle size="0.8rem" />}>
              Public
            </Tabs.Tab>
            <Tabs.Tab value="private" icon={<IconSettings size="0.8rem" />}>
              Private
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="all" pt="xs">
            all tab content
          </Tabs.Panel>

          <Tabs.Panel value="public" pt="xs">
            public tab content
          </Tabs.Panel>

          <Tabs.Panel value="private" pt="xs">
            private tab content
          </Tabs.Panel>
        </Tabs>
      </Box>
    </>
  );
}
