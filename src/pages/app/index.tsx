import { CardBox } from "@/components/mantine/Card";
import { HeaderMegaMenu } from "@/components/mantine/Nav";
import { Box, Button, Container, SimpleGrid, Tabs, Text } from "@mantine/core";
import { IconMessageCircle, IconPhoto, IconPlus } from "@tabler/icons-react";
import Link from "next/link";

export default function App() {
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
          </Tabs.List>

          <Tabs.Panel value="all" pt="xs">
            <Container py="xl">
              <SimpleGrid cols={3}>{CardBox({ type: "all" })}</SimpleGrid>
            </Container>
          </Tabs.Panel>

          <Tabs.Panel value="public" pt="xs">
            <Container py="xl">
              <SimpleGrid cols={3}>{CardBox({ type: "public" })}</SimpleGrid>
            </Container>
          </Tabs.Panel>
        </Tabs>
      </Box>
    </>
  );
}
