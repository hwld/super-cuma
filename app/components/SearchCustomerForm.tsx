import { Card } from "react-bootstrap";
import { ValidatedForm } from "remix-validated-form";
import { customerSearchValidator } from "~/forms/customerSearchForm";

type Props = {};
export const SearchCustomerForm: React.VFC<Props> = () => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>顧客検索</Card.Title>
        <ValidatedForm validator={customerSearchValidator}></ValidatedForm>
      </Card.Body>
    </Card>
  );
};
