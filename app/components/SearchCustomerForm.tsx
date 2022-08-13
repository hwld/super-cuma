import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormLabel,
  Grid,
  Stack,
} from "@mui/material";
import type { FormMethod } from "@remix-run/react";
import { Link, useSearchParams } from "@remix-run/react";
import { useMemo } from "react";
import { ValidatedForm } from "remix-validated-form";
import {
  customerSearchFormSchema,
  customerSearchValidator,
} from "~/forms/customerSearchForm";
import type { Prefecture } from "~/models/prefecture";
import { FormAutoComplete } from "./FormAutoComplete";
import { FormInput } from "./FormInput";

const formFields = Object.keys(customerSearchFormSchema.shape);

type Props = { prefectures: Prefecture[]; method: FormMethod };
export const SearchCustomerForm: React.VFC<Props> = ({
  prefectures,
  method,
}) => {
  const formId = "search-customer-form";

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
      <CardHeader title="顧客検索" />
      <CardContent>
        <ValidatedForm
          id={formId}
          validator={customerSearchValidator}
          method={method}
          defaultValues={Object.fromEntries(searchParams.entries())}
        >
          <Grid container columns={16} spacing={2}>
            <Grid item xs={16} md={8}>
              <Stack gap={2}>
                <Stack gap={1}>
                  <FormLabel
                    htmlFor="customerCd"
                    sx={{ alignSelf: "flex-start" }}
                  >
                    顧客コード
                  </FormLabel>
                  <FormInput size="small" name="customerCd" id="customerCd" />
                </Stack>
                <Stack gap={1}>
                  <FormLabel htmlFor="name" sx={{ alignSelf: "flex-start" }}>
                    顧客名
                  </FormLabel>
                  <FormInput size="small" name="name" id="name" />
                </Stack>
                <Stack gap={1}>
                  <FormLabel htmlFor="kana" sx={{ alignSelf: "flex-start" }}>
                    顧客名(カナ)
                  </FormLabel>
                  <FormInput size="small" name="kana" id="kana" />
                </Stack>
                <Stack gap={1}>
                  <FormLabel
                    htmlFor="companyName"
                    sx={{ alignSelf: "flex-start" }}
                  >
                    会社名
                  </FormLabel>
                  <FormInput size="small" name="companyName" id="companyName" />
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={16} md={8}>
              <Stack gap={2}>
                <Stack gap={1}>
                  <FormLabel
                    htmlFor="prefecture"
                    sx={{ alignSelf: "flex-start" }}
                  >
                    都道府県
                  </FormLabel>
                  <FormAutoComplete
                    size="small"
                    name="prefectureId"
                    id="prefecture"
                    items={prefectures.map((pref) => ({
                      label: pref.prefName,
                      value: pref.id.toString(),
                    }))}
                    allowEmpty
                  />
                </Stack>
                <Stack gap={1}>
                  <FormLabel htmlFor="phone" sx={{ alignSelf: "flex-start" }}>
                    電話番号
                  </FormLabel>
                  <FormInput size="small" name="phone" id="phone" />
                </Stack>
                <Stack gap={1}>
                  <FormLabel htmlFor="email" sx={{ alignSelf: "flex-start" }}>
                    メールアドレス
                  </FormLabel>
                  <FormInput size="small" name="email" id="email" />
                </Stack>
                <Stack gap={1}>
                  <FormLabel
                    htmlFor="lasttradeStart"
                    sx={{ alignSelf: "flex-start" }}
                  >
                    最終取引日
                  </FormLabel>
                  <Stack
                    direction="row"
                    justifyContent="stretch"
                    alignItems="center"
                    gap={1}
                  >
                    <FormInput
                      size="small"
                      name="lasttradeStart"
                      id="lasttradeStart"
                      type="date"
                    />
                    <div>～</div>
                    <FormInput size="small" name="lasttradeEnd" type="date" />
                  </Stack>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </ValidatedForm>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end", gap: 1 }}>
        <Button variant="contained" type="submit" form={formId}>
          検索
        </Button>
        <Button
          variant="contained"
          component={Link}
          to={resetUrl}
          reloadDocument
        >
          クリア
        </Button>
      </CardActions>
    </Card>
  );
};
