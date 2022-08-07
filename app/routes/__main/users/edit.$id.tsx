import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import type { FieldErrors } from "remix-validated-form";
import { UserForm } from "~/components/UserForm";
import type { UserForm as UserFormData } from "~/forms/userForm";
import { userFormValidator } from "~/forms/userForm";
import { editUser, findUser } from "~/models/user/finder.server";
import { authenticator, requireAuthentication } from "~/services/auth.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  if (typeof params.id !== "string") {
    throw new Error("不正なリクエストです");
  }
  const userId = Number(params.id);

  const loggedInUser = await requireAuthentication(
    request,
    (user) => user.isAdmin || user.id === userId
  );

  const user = await findUser({ where: { id: userId } });
  if (!user) {
    return json(null);
  }
  const userForm: UserFormData = {
    username: user.username,
    password: "",
    isAdmin: user.isAdmin,
  };
  return json({ userForm, loggedInUser });
};

type EditingResult = {
  fieldErrors: FieldErrors | undefined;
  formError: string | undefined;
};

export const action = async ({ request, params }: ActionArgs) => {
  if (typeof params.id !== "string") {
    throw new Error("不正なリクエストです");
  }
  const userId = Number(params.id);

  const loggedInUser = await requireAuthentication(
    request,
    (user) => user.isAdmin || user.id === userId
  );

  const result = await userFormValidator.validate(await request.formData());
  if (result.error) {
    return json<EditingResult>({
      fieldErrors: result.error.fieldErrors,
      formError: undefined,
    });
  }

  const editingResult = await editUser(userId, {
    username: result.data.username,
    password: result.data.password,
    isAdmin: loggedInUser.isAdmin ? result.data.isAdmin : undefined,
  });
  if (editingResult.type === "error") {
    return json<EditingResult>({
      fieldErrors: undefined,
      formError: editingResult.message,
    });
  }

  if (loggedInUser.id === userId) {
    await authenticator.logout(request, { redirectTo: "/login" });
  }

  return redirect("/users");
};

export default function EditUser() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <h3>ユーザー編集</h3>
      <UserForm
        defaultValues={loaderData?.userForm ?? undefined}
        formError={actionData?.formError ?? undefined}
        adminLoggedIn={loaderData?.loggedInUser.isAdmin ?? undefined}
      />
    </div>
  );
}
