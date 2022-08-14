import { CssBaseline, ThemeProvider } from "@mui/material";
import { RemixBrowser } from "@remix-run/react";
import { hydrate } from "react-dom";
import { theme } from "./theme";

hydrate(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <RemixBrowser />
  </ThemeProvider>,
  document
);
