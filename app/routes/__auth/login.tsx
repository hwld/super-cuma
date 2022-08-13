import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormLabel,
  Stack,
} from "@mui/material";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { AuthorizationError } from "remix-auth";
import { ValidatedForm } from "remix-validated-form";
import { FormInput } from "~/components/FormInput";

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
  const formId = "loginForm";
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <Stack alignItems="center" marginTop={10}>
        <Card sx={{ width: "500px" }}>
          <CardHeader title="ログイン" />
          <CardContent>
            <ValidatedForm
              id={formId}
              validator={loginFormValidator}
              className="card"
              style={{ width: "100%" }}
              method="post"
            >
              {actionData?.message && (
                <Box marginBottom={3}>
                  <Alert severity="error">{actionData.message}</Alert>
                </Box>
              )}
              <Stack spacing={2}>
                <Box>
                  <FormLabel>ユーザー名</FormLabel>
                  <FormInput name="username" size="small" />
                </Box>
                <Box>
                  <FormLabel>パスワード</FormLabel>
                  <FormInput
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    size="small"
                  />
                </Box>
              </Stack>
            </ValidatedForm>
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button type="submit" variant="contained" form={formId}>
              ログイン
            </Button>
          </CardActions>
        </Card>
      </Stack>
    </div>
  );
}
