import { CssBaseline, ThemeProvider } from "@mui/material";
import type { EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import { theme } from "./theme";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  let markup = renderToString(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RemixServer context={remixContext} url={request.url} />
    </ThemeProvider>
  );

  responseHeaders.set("Content-Type", "text/html");

  return new Response(`<!DOCTYPE html> ` + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
