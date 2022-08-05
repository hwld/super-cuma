import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { Button, Table } from "react-bootstrap";
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
      <h3>ユーザー一覧</h3>
      {loggedInUser.isAdmin && (
        <div className="text-end">
          <Link to="add" className="btn btn-primary">
            ユーザー登録
          </Link>
        </div>
      )}
      <Table>
        <thead>
          <tr>
            <th>ユーザーID</th>
            <th>ユーザー名</th>
            <th>更新・削除</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            return (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>

                {loggedInUser.isAdmin || loggedInUser.id === user.id ? (
                  <td className="d-flex gap-1">
                    <Link
                      to={`edit/${user.id}`}
                      className="btn btn-success btn-sm"
                    >
                      更新
                    </Link>
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
                      <Button type="submit" className="btn btn-danger btn-sm">
                        削除
                      </Button>
                    </fetcher.Form>
                  </td>
                ) : (
                  <td></td>
                )}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
