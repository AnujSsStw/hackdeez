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
} from "@mantine/core";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function App() {
  function handleCreatePlan() {
    alert("Create Plan");
  }

  return (
    <>
      <HeaderMegaMenu />
      <Box mx="auto">
        {/* <BackgroundImage
          src="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80"
          radius="sm"
        > */}
        <Box
          p="md"
          maw={700}
          display={"flex"}
          sx={{ alignItems: "center" }}
          mx={"auto"}
        >
          <Text>My Plans</Text>
          <Button variant="light" color="blue" ml={"auto"}>
            <Link href="/app/create">Create Plan</Link>
          </Button>
        </Box>
        {/* </BackgroundImage> */}
      </Box>

      <Box mx="auto" my="md">
        <Center>
          <Paper radius="md" shadow="md">
            <Text>Plan 1</Text>
          </Paper>
        </Center>
      </Box>
    </>
  );
}
