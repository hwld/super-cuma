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
      <AppHeader maxWidth="xl" />
      <Container maxWidth="xl">
        <Outlet />
      </Container>
    </Box>
  );
}
