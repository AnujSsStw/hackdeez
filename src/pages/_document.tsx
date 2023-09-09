import { ThemeProvider } from "@/components/theme-provider";
import { Html, Head, Main, NextScript } from "next/document";
import { createGetInitialProps } from "@mantine/next";

export default function Document() {
  const getInitialProps = createGetInitialProps();
  return (
    <Html lang="en">
      <Head />
      {/* <ThemeProvider attribute="class" defaultTheme="dark" enableSystem> */}
      <body>
        <Main />
        <NextScript />
      </body>
      {/* </ThemeProvider> */}
    </Html>
  );
}
