import { Box, Container } from "@mui/material";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { AppHeader } from "~/components/AppHeader";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: LoaderArgs) => {
  await authenticator.isAuthenticated(request, { failureRedirect: "/login" });
  return json(null);
};

export default function Main() {
  return (
    <Box marginBottom={5}>
      <AppHeader maxWidth="lg" />
      <Container maxWidth="lg" component="main">
        <Box paddingTop={3}>
          <Outlet />
        </Box>
      </Container>
    </Box>
  );
}
