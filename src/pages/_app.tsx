import "@/styles/globals.css";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { Notifications } from "@mantine/notifications";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function ClerkConvexAdapter() {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      convex.setAuth(async () =>
        getToken({ template: "convex", skipCache: true })
      );
    } else {
      convex.clearAuth();
    }
  }, [getToken, isSignedIn]);
  return null;
}

function MyApp(props: AppProps) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme,
        }}
      >
        <ClerkProvider
          {...pageProps}
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
          appearance={{
            baseTheme: "dark",
            layout: "centered",
          }}
        >
          <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <Notifications />
            <Component {...pageProps} />
          </ConvexProviderWithClerk>
        </ClerkProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default MyApp;
