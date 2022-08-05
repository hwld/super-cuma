import { Button } from "react-bootstrap";
import { ValidatedForm } from "remix-validated-form";
import type { UserForm as UserFormData } from "~/forms/userForm";
import { userFormValidator } from "~/forms/userForm";
import { FormInput } from "./FormInput";
import { FormLabel } from "./FormLabel";
import { HorizontalFormRow } from "./HorizontalFormRow";

type Props = {
  defaultValues?: Partial<UserFormData>;
  formError?: string;
};

export const UserForm: React.VFC<Props> = ({ defaultValues, formError }) => {
  return (
    <ValidatedForm
      validator={userFormValidator}
      method="post"
      defaultValues={defaultValues}
    >
      {formError && <div className="alert alert-danger">{formError}</div>}
      <HorizontalFormRow
        label={
          <FormLabel text="ユーザー名" required htmlFor="userForm-username" />
        }
        input={<FormInput id="userForm-username" name="username" />}
      />
      <HorizontalFormRow
        label={
          <FormLabel text="パスワード" required htmlFor="userForm-password" />
        }
        input={
          <FormInput
            id="userForm-password"
            name="password"
            type="password"
            autoComplete="new-password"
          />
        }
      />
      <div className="text-end">
        <Button type="submit">
          {defaultValues === undefined ? "登録" : "更新"}
        </Button>
      </div>
    </ValidatedForm>
  );
};
