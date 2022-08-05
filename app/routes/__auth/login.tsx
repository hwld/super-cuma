import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { Button, Card } from "react-bootstrap";
import { AuthorizationError } from "remix-auth";
import { ValidatedForm } from "remix-validated-form";
import { FormInput } from "~/components/FormInput";
import { FormLabel } from "~/components/FormLabel";
import { loginFormValidator } from "~/forms/loginForm";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: LoaderArgs) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/customers",
  });

  return json({});
};

export const action = async ({ request }: ActionArgs) => {
  try {
    await authenticator.authenticate("user-pass", request, {
      successRedirect: "/customers",
      throwOnError: true,
    });

    // typeof actionの推論を効かせるために書いた。
    // なくても上でredirectされると思う。
    return redirect("/customers");
  } catch (e) {
    if (e instanceof AuthorizationError) {
      //　クライアント側でもバリデーションを行うことを考えると、
      // サーバー側でバリデーションが失敗したときはシンプルに401を返すだけでいいかも
      return json({ message: e.message });
    }
    throw e;
  }
};

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="d-flex justify-content-center mt-5">
      <ValidatedForm
        validator={loginFormValidator}
        className="card"
        style={{ width: "500px", maxWidth: "100%" }}
        method="post"
      >
        <Card.Header>ログイン</Card.Header>
        <Card.Body>
          {actionData?.message && (
            <div className="alert alert-danger">{actionData.message}</div>
          )}
          <div className="mb-1">
            <FormLabel text="ユーザー名" />
            <FormInput name="username" />
          </div>
          <div>
            <FormLabel text="パスワード" />
            <FormInput
              name="password"
              type="password"
              autoComplete="current-password"
            />
          </div>
          <div className="text-end mt-3">
            <Button type="submit" className="px-3 py-1">
              ログイン
            </Button>
          </div>
        </Card.Body>
      </ValidatedForm>
    </div>
  );
}
