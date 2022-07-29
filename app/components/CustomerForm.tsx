import { Button } from "react-bootstrap";
import { ValidatedForm } from "remix-validated-form";
import type { z } from "zod";
import type { customerFormSchema } from "~/forms/customerForm";
import { customerValidator } from "~/forms/customerForm";
import { AppFormInput } from "./AppFormInput";
import { AppFormRadio } from "./AppFormRadio";
import { AppFormRow } from "./AppFormRow";
import { AppFormSelect } from "./AppFormSelect";

type Props = {
  companies: { companyName: string; id: number }[];
  prefectures: { prefName: string; id: number }[];
  defaultValues?: Partial<z.infer<typeof customerFormSchema>>;
};

export const CustomerForm: React.VFC<Props> = ({
  companies,
  prefectures,
  defaultValues,
}) => {
  return (
    <ValidatedForm
      validator={customerValidator}
      defaultValues={defaultValues}
      method="post"
      className="mb-3"
    >
      <AppFormRow>
        <AppFormInput label="顧客コード" name="customerCd" required />
      </AppFormRow>
      <AppFormRow>
        <AppFormInput label="顧客名" name="name" required />
      </AppFormRow>
      <AppFormRow>
        <AppFormInput label="顧客名(カナ)" name="kana" required />
      </AppFormRow>
      <AppFormRow>
        <AppFormRadio
          fieldName="性別"
          name="gender"
          items={[
            { label: "男性", value: "1" },
            { label: "女性", value: "2" },
          ]}
          required
        />
      </AppFormRow>
      <AppFormRow>
        <AppFormSelect
          name="companyId"
          label="会社名"
          items={companies.map((company) => ({
            label: company.companyName,
            value: company.id,
          }))}
          required
        />
      </AppFormRow>
      <AppFormRow>
        <AppFormInput label="郵便番号" name="zip" />
      </AppFormRow>
      <AppFormRow>
        <AppFormSelect
          name="prefectureId"
          label="都道府県"
          items={prefectures.map((pref) => ({
            label: pref.prefName,
            value: pref.id,
          }))}
          required
        />
      </AppFormRow>
      <AppFormRow>
        <AppFormInput label="住所1" name="address1" />
      </AppFormRow>
      <AppFormRow>
        <AppFormInput label="住所2" name="address2" />
      </AppFormRow>
      <AppFormRow>
        <AppFormInput label="電話番号" name="phone" required />
      </AppFormRow>
      <AppFormRow>
        <AppFormInput label="FAX" name="fax" />
      </AppFormRow>
      <AppFormRow>
        <AppFormInput label="メールアドレス" name="email" required />
      </AppFormRow>
      <AppFormRow>
        {/* ここにdefaultValueが入ってない。 
        yyyy-mm-dd形式で渡さなきゃいけないのが、ISO 8601形式で日付まで入ってるっぽいからどうにかする */}
        <AppFormInput label="最終取引日" name="lasttrade" type="date" />
      </AppFormRow>

      <div className="text-end">
        <Button type="submit">登録</Button>
      </div>
    </ValidatedForm>
  );
};
