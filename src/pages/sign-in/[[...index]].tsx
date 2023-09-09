import { SignIn } from "@clerk/nextjs";
import { Box } from "@mantine/core";

const SignInPage = () => (
  <Box
    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    h={"100vh"}
  >
    <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
  </Box>
);
export default SignInPage;
