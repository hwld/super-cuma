import type { FormMethod } from "@remix-run/react";
import { Link, useSearchParams } from "@remix-run/react";
import { useMemo } from "react";
import { Button, Card } from "react-bootstrap";
import { ValidatedForm } from "remix-validated-form";
import {
  customerSearchFormSchema,
  customerSearchValidator,
} from "~/forms/customerSearchForm";
import type { Prefecture } from "~/models/prefecture";
import { FormInput } from "./FormInput";
import { FormLabel } from "./FormLabel";
import { FormSelect } from "./FormSelect";

const formFields = Object.keys(customerSearchFormSchema.shape);

type Props = { prefectures: Prefecture[]; method: FormMethod };
export const SearchCustomerForm: React.VFC<Props> = ({
  prefectures,
  method,
}) => {
  const buildId = (id: string) => `searchCustomerForm-${id}`;

  const [searchParams] = useSearchParams();

  const resetUrl = useMemo(() => {
    // 検索フォームに関係するクエリを削除したパスを作成する
    const params = new URLSearchParams(searchParams);
    formFields.forEach((field) => {
      params.delete(field);
    });
    return `?${params.toString()}`;
  }, [searchParams]);

  return (
    <Card>
      <Card.Body>
        <Card.Title>顧客検索</Card.Title>
        <ValidatedForm
          id="search-customer-form"
          validator={customerSearchValidator}
          method={method}
          defaultValues={Object.fromEntries(searchParams.entries())}
        >
          <div className="row">
            <div className="col">
              <div>
                <FormLabel text="顧客コード" htmlFor={buildId("customerCd")} />
                <FormInput
                  id={buildId("customerCd")}
                  name="customerCd"
                  size="sm"
                />
              </div>
              <div>
                <FormLabel text="顧客名" htmlFor={buildId("name")} />
                <FormInput id={buildId("name")} name="name" size="sm" />
              </div>
              <div>
                <FormLabel text="顧客名(カナ)" htmlFor={buildId("kana")} />
                <FormInput id={buildId("kana")} name="kana" size="sm" />
              </div>
              <div>
                <FormLabel text="会社名" htmlFor={buildId("companyName")} />
                <FormInput
                  id={buildId("companyName")}
                  name="companyName"
                  size="sm"
                />
              </div>
            </div>
            <div className="col">
              <div>
                <FormLabel text="都道府県" htmlFor={buildId("prefectureId")} />
                <FormSelect
                  id={buildId("prefectureId")}
                  name="prefectureId"
                  items={[
                    { label: "", value: undefined },
                    ...prefectures.map((pref) => ({
                      label: pref.prefName,
                      value: pref.id,
                    })),
                  ]}
                  size="sm"
                />
              </div>
              <div>
                <FormLabel text="電話番号" htmlFor={buildId("phone")} />
                <FormInput id={buildId("phone")} name="phone" size="sm" />
              </div>
              <div>
                <FormLabel text="メールアドレス" htmlFor={buildId("email")} />
                <FormInput id={buildId("email")} name="email" size="sm" />
              </div>
              <div>
                <FormLabel text="最終取引日" />
                <div className="d-flex">
                  <div className="flex-grow-1">
                    <FormInput name="lasttradeStart" size="sm" type="date" />
                  </div>
                  <div className="d-flex align-items-center">～</div>
                  <div className="flex-grow-1">
                    <FormInput name="lasttradeEnd" size="sm" type="date" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-3">
            <Button type="submit" className="px-3 py-1 me-1">
              検索
            </Button>
            <Link
              to={resetUrl}
              className="px-3 py-1 btn-secondary btn"
              reloadDocument
            >
              クリア
            </Link>
          </div>
        </ValidatedForm>
      </Card.Body>
    </Card>
  );
};
