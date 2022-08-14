import { Alert, Box, Button, FormLabel } from "@mui/material";

import { ValidatedForm } from "remix-validated-form";
import type { UserForm as UserFormData } from "~/forms/userForm";
import { userFormValidator } from "~/forms/userForm";
import { FormCheckbox } from "./FormCheckbox";
import { FormInput } from "./FormInput";
import { HorizontalFormRow } from "./HorizontalFormRow";

type Props = {
  defaultValues?: Partial<UserFormData>;
  formError?: string;
  adminLoggedIn?: boolean;
};

export const UserForm: React.VFC<Props> = ({
  defaultValues,
  formError,
  adminLoggedIn = false,
}) => {
  return (
    <ValidatedForm
      validator={userFormValidator}
      method="post"
      defaultValues={defaultValues}
    >
      {formError && (
        <Box marginBottom={3}>
          <Alert severity="error">{formError}</Alert>
        </Box>
      )}
      <HorizontalFormRow
        label={
          <FormLabel required htmlFor="userForm-username">
            ユーザー名
          </FormLabel>
        }
        input={
          <FormInput id="userForm-username" name="username" size="small" />
        }
      />
      <HorizontalFormRow
        label={
          <FormLabel required htmlFor="userForm-password">
            パスワード
          </FormLabel>
        }
        input={
          <FormInput
            id="userForm-password"
            name="password"
            type="password"
            autoComplete="new-password"
            size="small"
          />
        }
      />
      {adminLoggedIn && (
        <HorizontalFormRow
          input={
            <FormCheckbox
              label="管理者"
              name="isAdmin"
              value="true"
              offValue="false"
            />
          }
        />
      )}
      <Box marginTop={3} textAlign="end">
        <Button type="submit">
          {defaultValues === undefined ? "登録" : "更新"}
        </Button>
      </Box>
    </ValidatedForm>
  );
};
