import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import type { FieldErrors } from "remix-validated-form";
import { UserForm } from "~/components/UserForm";
import { userFormValidator } from "~/forms/userForm";
import { editUser, findUser } from "~/models/user/finder.server";

export const loader = async ({ params }: LoaderArgs) => {
  if (typeof params.id !== "string") {
    throw new Error("不正なリクエストです");
  }
  const userId = Number(params.id);

  const user = await findUser({ where: { id: userId } });
  return json({ user });
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

  const result = await userFormValidator.validate(await request.formData());
  if (result.error) {
    return json<EditingResult>({
      fieldErrors: result.error.fieldErrors,
      formError: undefined,
    });
  }

  const editingResult = await editUser(userId, result.data);
  if (editingResult.type === "error") {
    return json<EditingResult>({
      fieldErrors: undefined,
      formError: editingResult.message,
    });
  }

  return redirect("/users");
};

export default function EditUser() {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <h3>ユーザー編集</h3>
      <UserForm
        defaultValues={user}
        formError={actionData?.formError ?? undefined}
      />
    </div>
  );
}
