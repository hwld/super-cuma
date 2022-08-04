import type { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  businessCategories,
  companies,
  customers,
  prefectures,
  products,
  sales,
} from "./consts.server";

const db = new PrismaClient();

async function seed() {
  //　ユーザー
  const userId = 1;
  const username = "user";
  const password = await bcrypt.hash("passwd", 10);
  await db.user.upsert({
    where: { id: userId },
    update: { id: userId, username, password },
    create: { id: userId, username, password },
  });

  //　都道府県
  for (let i = 0; i < prefectures.length; i++) {
    await db.prefecture.upsert({
      where: { id: i + 1 },
      update: { id: i + 1, prefName: prefectures[i] },
      create: { id: i + 1, prefName: prefectures[i] },
    });
  }
  console.log("upsertd prefectures");

  // 業種
  for (const [id, businessCategoryName] of businessCategories) {
    await db.businessCategory.upsert({
      where: { id },
      update: { id, businessCategoryName },
      create: { id, businessCategoryName },
    });
  }
  console.log("upsert businessCategories");

  // 会社
  for (const [id, categoryId, name, kana] of companies) {
    const data: Prisma.CompanyUncheckedCreateInput = {
      id,
      companyName: name,
      companyKana: kana,
      businessCategoryId: categoryId,
    };
    await db.company.upsert({
      where: { id },
      update: data,
      create: data,
    });
  }
  console.log("upsert companies");

  // 顧客
  for (const [
    id,
    customerCd,
    name,
    kana,
    gender,
    companyId,
    zip,
    prefectureId,
    address1,
    address2,
    phone,
    fax,
    email,
    lasttrade,
  ] of customers) {
    const data = {
      id,
      customerCd,
      name,
      kana,
      gender,
      companyId,
      zip,
      prefectureId,
      address1,
      address2,
      phone,
      fax,
      email,
      lasttrade,
    };
    await db.customer.upsert({
      where: { id },
      update: data,
      create: data,
    });
  }
  console.log("upsert customers");

  // 商品
  for (const [id, productName, unitPrice, created, modified] of products) {
    await db.product.upsert({
      where: { id },
      update: { id, productName, unitPrice, created, modified },
      create: { id, productName, unitPrice, created, modified },
    });
  }
  console.log("upsert products");

  // 売上
  for (const [
    id,
    purchaseDate,
    customerId,
    productId,
    amount,
    created,
    modified,
  ] of sales) {
    await db.sale.upsert({
      where: { id },
      update: {
        id,
        purchaseDate,
        customerId,
        productId,
        amount,
        created,
        modified,
      },
      create: {
        id,
        purchaseDate,
        customerId,
        productId,
        amount,
        created,
        modified,
      },
    });
  }
  console.log("upsert sales");
}

seed();
