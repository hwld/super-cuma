import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import type { FieldErrors } from "remix-validated-form";
import { UserForm } from "~/components/UserForm";
import { userFormValidator } from "~/forms/userForm";
import { createUser } from "~/models/user/finder.server";
import { requireAuthentication } from "~/services/auth.server";

type CreationResult = {
  fieldErrors: FieldErrors | undefined;
  formError: string | undefined;
};

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireAuthentication(request, (user) => user.isAdmin);
  return json({ user });
};

export const action = async ({ request }: ActionArgs) => {
  const user = await requireAuthentication(request, (user) => user.isAdmin);

  const result = await userFormValidator.validate(await request.formData());

  if (result.error) {
    return json<CreationResult>({
      fieldErrors: result.error.fieldErrors,
      formError: undefined,
    });
  }

  const creationResult = await createUser({
    username: result.data.username,
    password: result.data.password,
    // 管理者としてログインしていればisAdminを渡すが、それ以外の場合は渡さない。
    isAdmin: user.isAdmin ? result.data.isAdmin : undefined,
  });
  if (creationResult.type === "error") {
    // remix-validated-formのvalidationErrorを使いたかったが、
    // errorがundefinedのときには使えないので・・・
    return json<CreationResult>({
      fieldErrors: undefined,
      formError: creationResult.message,
    });
  }

  return redirect("/users");
};

export default function AddUser() {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <h3 className="mb-4">ユーザー登録</h3>
      <UserForm
        formError={actionData?.formError ?? undefined}
        adminLoggedIn={user.isAdmin}
      />
    </div>
  );
}
