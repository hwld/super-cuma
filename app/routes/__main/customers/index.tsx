import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { Button, Table } from "react-bootstrap";
import { SearchCustomerForm } from "~/components/SearchCustomerForm";
import { db } from "~/db.server";
import { findCustomers } from "~/models/customer";

export const loader = async () => {
  const customers = await findCustomers();
  return json({ customers });
};

export const action = async ({ request }: ActionArgs) => {
  if (request.method === "DELETE") {
    const formData = await request.formData();
    const id = formData.get("customerId");
    if (typeof id !== "string") {
      throw new Error("フォームが正しく送信されませんでした。");
    }

    await db.customer.delete({ where: { id: parseInt(id) } });
  }
  return json(null);
};

export default function Index() {
  const { customers } = useLoaderData<typeof loader>();

  return (
    <div>
      <h3>顧客一覧</h3>
      <SearchCustomerForm />
      <div className="text-end">
        <Link to="add" className="btn btn-primary">
          新規登録
        </Link>
      </div>
      <Table>
        <thead>
          <tr>
            <th>顧客コード</th>
            <th>顧客名</th>
            <th>顧客名(カナ)</th>
            <th>会社名</th>
            <th>都道府県</th>
            <th>電話番号</th>
            <th>Email</th>
            <th>更新・削除</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => {
            return (
              <tr key={customer.id}>
                <td>{customer.customerCd}</td>
                <td>{customer.name}</td>
                <td>{customer.kana}</td>
                <td>{customer.company.companyName}</td>
                <td>{customer.prefecture.prefName}</td>
                <td>{customer.phone}</td>
                <td>{customer.email}</td>
                <td>
                  <div className="d-flex gap-1">
                    <Link
                      to={`/customers/edit/${customer.id}`}
                      className="btn btn-success btn-sm"
                    >
                      更新
                    </Link>
                    <Form
                      method="delete"
                      onSubmit={(e) => {
                        const result = window.confirm(
                          `顧客名: ${customer.name} を削除しても良いですか?`
                        );
                        if (!result) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <input
                        hidden
                        name="customerId"
                        defaultValue={customer.id}
                      />
                      <Button type="submit" className="btn btn-danger btn-sm">
                        削除
                      </Button>
                    </Form>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
