import { parse } from "csv";
import { createReadStream } from "fs";
import { unlink } from "fs/promises";
import type { Readable } from "stream";
import type { CustomerForm } from "~/forms/customerForm";
import { createCustomer } from "~/models/customer/finder.server";

const createCustomersFromStream = async (stream: Readable) => {
  let firstLine = true;
  for await (const chunk of stream) {
    if (firstLine) {
      firstLine = false;
      continue;
    }

    const customer: CustomerForm = {
      customerCd: chunk[0],
      name: chunk[1],
      kana: chunk[2],
      gender: chunk[3],
      companyId: chunk[4],
      zip: chunk[5],
      prefectureId: chunk[6],
      address1: chunk[7],
      address2: chunk[8],
      phone: chunk[9],
      fax: chunk[10],
      email: chunk[11],
      lasttrade: chunk[12],
    };
    await createCustomer(customer);
  }
};

type Option = { removeAfter?: boolean };
export const importCustomersFromCsv = async (
  filePath: string,
  option?: Option
) => {
  try {
    await createCustomersFromStream(
      createReadStream(filePath).pipe(parse({ delimiter: "," }))
    );
  } finally {
    if (option?.removeAfter) {
      await unlink(filePath);
    }
  }
};
