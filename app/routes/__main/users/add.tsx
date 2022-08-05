import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import type { FieldErrors } from "remix-validated-form";
import { UserForm } from "~/components/UserForm";
import { userFormValidator } from "~/forms/userForm";
import { createUser } from "~/models/user/finder.server";

type CreationResult = {
  fieldErrors: FieldErrors | undefined;
  formError: string | undefined;
};

export const action = async ({ request }: ActionArgs) => {
  const result = await userFormValidator.validate(await request.formData());

  if (result.error) {
    return json<CreationResult>({
      fieldErrors: result.error.fieldErrors,
      formError: undefined,
    });
  }

  const creationResult = await createUser(result.data);
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
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <h3 className="mb-4">ユーザー登録</h3>
      <UserForm formError={actionData?.formError && undefined} />
    </div>
  );
}
