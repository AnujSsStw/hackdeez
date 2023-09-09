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

export function AuthenticationTitle() {
  const router = useRouter();
  function handleStart() {
    const id = guid();
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
        <TextInput label="Name" placeholder="you@mantine" required />
        <Textarea
          placeholder="Your comment"
          label="Your comment"
          withAsterisk
          pt={10}
        />
        <Button fullWidth mt="xl" onClick={handleStart}>
          Start
        </Button>
      </Paper>
    </Container>
  );
}
