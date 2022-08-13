import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";

import { findUsers } from "~/models/user/finder.server";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: LoaderArgs) => {
  const loggedInUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const users = await findUsers();
  return json({ users, loggedInUser });
};

export default function UsersHome() {
  const { users, loggedInUser } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <div>
      <Typography variant="h5" marginBottom={3}>
        ユーザー一覧
      </Typography>
      {loggedInUser.isAdmin && (
        <Box textAlign="end" marginBottom={1}>
          <Button variant="contained" component={Link} to="add">
            ユーザー登録
          </Button>
        </Box>
      )}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ユーザーID</TableCell>
              <TableCell>ユーザー名</TableCell>
              <TableCell>更新・削除</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              return (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>

                  {loggedInUser.isAdmin || loggedInUser.id === user.id ? (
                    <TableCell>
                      <Stack direction="row" gap={1}>
                        <Button
                          variant="contained"
                          component={Link}
                          to={`edit/${user.id}`}
                        >
                          更新
                        </Button>
                        <Box>
                          <fetcher.Form
                            action={`delete/${user.id}`}
                            method="delete"
                            onSubmit={(e) => {
                              const result =
                                window.confirm(`ユーザー: ${user.username} を削除しても良いですか？
                       `);
                              if (!result) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <Button type="submit" variant="contained">
                              削除
                            </Button>
                          </fetcher.Form>
                        </Box>
                      </Stack>
                    </TableCell>
                  ) : (
                    <TableCell></TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
