import { CssBaseline } from "@mui/material";
import { RemixBrowser } from "@remix-run/react";
import { hydrate } from "react-dom";

hydrate(
  <>
    <CssBaseline />
    <RemixBrowser />
  </>,
  document
);
