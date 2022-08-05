import type { Company } from "../company/index";
import type { Prefecture } from "../prefecture/index";

export type Customer = {
  id: number;
  customerCd: string;
  name: string;
  kana: string;
  gender: number;
  zip?: string;
  address1?: string;
  address2?: string;
  phone: string;
  fax?: string;
  email: string;
  lasttrade?: Date;
  created: Date;
  modified: Date;
  company: Company;
  prefecture: Prefecture;
};
