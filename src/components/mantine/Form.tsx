import { guid } from "@/util/helper";
import {
  Button,
  Container,
  Paper,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useForm } from "@mantine/form";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/clerk-react";

export function AuthenticationTitle() {
  const form = useForm({
    initialValues: {
      name: "",
      des: "",
    },
  });
  const router = useRouter();
  const geoMut = useMutation(api.map.insertMap);
  const user = useUser();

  async function handleMapCreation() {
    const id = guid();

    await geoMut({
      mapId: id,
      name: form.values.name,
      des: form.values.des,
      isPublic: false,
      sendInvite: {
        restricted: true,
        canEdit: [],
      },
      userId: user.user?.id as string,
    });

    router.push(`/app/room/${id}`);
  }

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Welcome back!
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleMapCreation)}>
          <TextInput
            label="Name"
            placeholder="London adventure"
            required
            {...form.getInputProps("name")}
          />
          <Textarea
            {...form.getInputProps("des")}
            placeholder="Cool place to visit"
            label="Description"
            withAsterisk
            pt={10}
          />
          <Button
            fullWidth
            mt="xl"
            type="submit"
            variant="outline"
            color="orange"
          >
            Start
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
