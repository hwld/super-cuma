import { Button } from "react-bootstrap";
import { ValidatedForm } from "remix-validated-form";
import type { CustomerForm as CustomerFormData } from "~/forms/customerForm";
import { customerValidator } from "~/forms/customerForm";
import type { Company } from "~/models/company";
import type { Prefecture } from "~/models/prefecture";
import { FormInput } from "./FormInput";
import { FormLabel } from "./FormLabel";
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
          <FormLabel
            text="顧客コード"
            required
            htmlFor={buildId("customerCd")}
          />
        }
        input={<FormInput id={buildId("customerCd")} name="customerCd" />}
      />
      <HorizontalFormRow
        label={<FormLabel text="顧客名" required htmlFor={buildId("name")} />}
        input={<FormInput id={buildId("name")} name="name" />}
      />
      <HorizontalFormRow
        label={
          <FormLabel text="顧客名(カナ)" required htmlFor={buildId("kana")} />
        }
        input={<FormInput id={buildId("kana")} name="kana" />}
      />
      <HorizontalFormRow
        label={<FormLabel text="性別" required />}
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
          <FormLabel text="会社名" required htmlFor={buildId("companyId")} />
        }
        input={
          <FormSelect
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
        label={<FormLabel text="郵便番号" htmlFor={buildId("zip")} />}
        input={<FormInput id={buildId("zip")} name="zip" />}
      />
      <HorizontalFormRow
        label={
          <FormLabel
            text="都道府県"
            htmlFor={buildId("prefectureId")}
            required
          />
        }
        input={
          <FormSelect
            id={buildId("prefectureId")}
            name="prefectureId"
            items={prefectures.map((pref) => ({
              label: pref.prefName,
              value: pref.id,
            }))}
          />
        }
      />
      <HorizontalFormRow
        label={<FormLabel text="住所1" htmlFor={buildId("address1")} />}
        input={<FormInput id={buildId("address1")} name="address1" />}
      />
      <HorizontalFormRow
        label={<FormLabel text="住所2" htmlFor={buildId("address2")} />}
        input={<FormInput id={buildId("address2")} name="address2" />}
      />
      <HorizontalFormRow
        label={
          <FormLabel text="電話番号" required htmlFor={buildId("phone")} />
        }
        input={<FormInput id={buildId("phone")} name="phone" />}
      />
      <HorizontalFormRow
        label={<FormLabel text="FAX" htmlFor={buildId("fax")} />}
        input={<FormInput id={buildId("fax")} name="fax" />}
      />
      <HorizontalFormRow
        label={
          <FormLabel
            text="メールアドレス"
            htmlFor={buildId("email")}
            required
          />
        }
        input={<FormInput id={buildId("email")} name="email" />}
      />
      <HorizontalFormRow
        label={<FormLabel text="最終取引日" htmlFor={buildId("lasttrade")} />}
        input={
          <FormInput id={buildId("lasttrade")} name="lasttrade" type="date" />
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
