import { Container } from "@mui/material";
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
    <div>
      <AppHeader maxWidth="xl" />
      <Container maxWidth="xl">
        <Outlet />
      </Container>
    </div>
  );
}
