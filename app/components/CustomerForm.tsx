import { Box, Button, FormLabel } from "@mui/material";
import { ValidatedForm } from "remix-validated-form";
import type { CustomerForm as CustomerFormData } from "~/forms/customerForm";
import { customerValidator } from "~/forms/customerForm";
import type { Company } from "~/models/company";
import type { Prefecture } from "~/models/prefecture";
import { FormAutoComplete } from "./FormAutoComplete";
import { FormInput } from "./FormInput";
import { FormRadio } from "./FormRadio";
import { FormSelect } from "./FormSelect";
import { HorizontalFormRow } from "./HorizontalFormRow";

type Props = {
  companies: Company[];
  prefectures: Prefecture[];
  defaultValues?: Partial<CustomerFormData>;
};

export const CustomerForm: React.VFC<Props> = ({
  companies,
  prefectures,
  defaultValues,
}) => {
  const buildId = (id: string) => `customerForm-${id}`;

  return (
    <ValidatedForm
      validator={customerValidator}
      defaultValues={defaultValues}
      method="post"
    >
      <HorizontalFormRow
        label={
          <FormLabel htmlFor={buildId("customerCd")} required>
            顧客コード
          </FormLabel>
        }
        input={
          <FormInput
            size="small"
            id={buildId("customerCd")}
            name="customerCd"
          />
        }
      />
      <HorizontalFormRow
        label={
          <FormLabel required htmlFor={buildId("name")}>
            顧客名
          </FormLabel>
        }
        input={<FormInput size="small" id={buildId("name")} name="name" />}
      />
      <HorizontalFormRow
        label={
          <FormLabel required htmlFor={buildId("kana")}>
            顧客名(カナ)
          </FormLabel>
        }
        input={<FormInput size="small" id={buildId("kana")} name="kana" />}
      />
      <HorizontalFormRow
        label={<FormLabel required>性別</FormLabel>}
        input={
          <FormRadio
            name="gender"
            items={[
              { label: "男性", value: "1" },
              { label: "女性", value: "2" },
            ]}
          />
        }
      />
      <HorizontalFormRow
        label={
          <FormLabel required htmlFor={buildId("companyId")}>
            会社名
          </FormLabel>
        }
        input={
          <FormSelect
            size="small"
            id={buildId("companyId")}
            name="companyId"
            items={companies.map((company) => ({
              label: company.companyName,
              value: company.id,
            }))}
          />
        }
      />
      <HorizontalFormRow
        label={<FormLabel htmlFor={buildId("zip")}>郵便番号</FormLabel>}
        input={<FormInput size="small" id={buildId("zip")} name="zip" />}
      />
      <HorizontalFormRow
        label={
          <FormLabel htmlFor={buildId("prefectureId")} required>
            都道府県
          </FormLabel>
        }
        input={
          <FormAutoComplete
            name="prefectureId"
            size="small"
            items={[
              { label: "", value: "" },
              ...prefectures.map((pref) => ({
                label: pref.prefName,
                value: pref.id.toString(),
              })),
            ]}
          />
        }
      />
      <HorizontalFormRow
        label={<FormLabel htmlFor={buildId("address1")}>住所1</FormLabel>}
        input={
          <FormInput size="small" id={buildId("address1")} name="address1" />
        }
      />
      <HorizontalFormRow
        label={<FormLabel htmlFor={buildId("address2")}>住所2</FormLabel>}
        input={
          <FormInput size="small" id={buildId("address2")} name="address2" />
        }
      />
      <HorizontalFormRow
        label={
          <FormLabel required htmlFor={buildId("phone")}>
            電話番号
          </FormLabel>
        }
        input={<FormInput size="small" id={buildId("phone")} name="phone" />}
      />
      <HorizontalFormRow
        label={<FormLabel htmlFor={buildId("fax")}>FAX</FormLabel>}
        input={<FormInput size="small" id={buildId("fax")} name="fax" />}
      />
      <HorizontalFormRow
        label={
          <FormLabel htmlFor={buildId("email")} required>
            メールアドレス
          </FormLabel>
        }
        input={<FormInput size="small" id={buildId("email")} name="email" />}
      />
      <HorizontalFormRow
        label={<FormLabel htmlFor={buildId("lasttrade")}>最終取引日</FormLabel>}
        input={
          <FormInput
            size="small"
            id={buildId("lasttrade")}
            name="lasttrade"
            type="date"
          />
        }
      />
      <Box textAlign="end">
        <Button type="submit" variant="contained">
          {defaultValues === undefined ? "登録" : "更新"}
        </Button>
      </Box>
    </ValidatedForm>
  );
};
