import type { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function seed() {
  const prefectures = [
    "北海道",
    "青森県",
    "岩手県",
    "宮城県",
    "秋田県",
    "山形県",
    "福島県",
    "茨城県",
    "栃木県",
    "群馬県",
    "埼玉県",
    "千葉県",
    "東京都",
    "神奈川県",
    "新潟県",
    "富山県",
    "石川県",
    "福井県",
    "山梨県",
    "長野県",
    "岐阜県",
    "静岡県",
    "愛知県",
    "三重県",
    "滋賀県",
    "京都府",
    "大阪府",
    "兵庫県",
    "奈良県",
    "和歌山県",
    "鳥取県",
    "島根県",
    "岡山県",
    "広島県",
    "山口県",
    "徳島県",
    "香川県",
    "愛媛県",
    "高知県",
    "福岡県",
    "佐賀県",
    "長崎県",
    "熊本県",
    "大分県",
    "宮崎県",
    "鹿児島県",
    "沖縄県",
  ];
  for (let i = 0; i < prefectures.length; i++) {
    await db.prefecture.upsert({
      where: { id: i + 1 },
      update: { id: i + 1, prefName: prefectures[i] },
      create: { id: i + 1, prefName: prefectures[i] },
    });
  }
  console.log("upsertd prefectures");

  const businessCategories = [
    [1, "製造業"],
    [2, "農業"],
    [3, "不動産業"],
    [4, "サービス業"],
    [5, "その他"],
  ] as const;
  for (const [id, businessCategoryName] of businessCategories) {
    await db.businessCategory.upsert({
      where: { id },
      update: { id, businessCategoryName },
      create: { id, businessCategoryName },
    });
  }
  console.log("upsert businessCategories");

  const companies = [
    [1, 1, "○○株式会社", "マルマルカブシキガイシャ"],
    [2, 2, "有限会社□□", "ユウゲンガイシャシカクシカク"],
    [3, 3, "△△不動産", "サンカクサンカクフドウサン"],
    [4, 4, "☆☆商店", "ホシホシショウテン"],
    [5, 5, "××株式会社", "バツバツカブシキガイシャ"],
  ] as const;
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

  const customers = [
    [
      1,
      "0001",
      "鈴木きょうこ",
      "スズキキョウコ",
      2,
      1,
      "131-0045",
      13,
      "墨田区押上1-1",
      "東京スカイツリー",
      "03-0000-0000",
      "03-0000-0000",
      "k_suzuki@test.co.jp",
      new Date("2012-07-02"),
      "",
      "",
    ],
    [
      2,
      "0002",
      "高橋ゆい",
      "タカハシユイ",
      2,
      1,
      "220-0012",
      14,
      "横浜市西区みなとみらい2-2",
      "横浜ランドマークタワー",
      "046-000-0000",
      "046-000-0000",
      "y_takahashi@test.co.jp",
      new Date("2011-04-01"),
      "",
      "",
    ],
    [
      3,
      "0003",
      "田中ちなつ",
      "タナカチナツ",
      2,
      2,
      "246-0022",
      12,
      "千葉市美浜区美浜1",
      "",
      "043-000-0000",
      "043-000-0000",
      "c_tanaka@test.co.jp",
      new Date("2012-07-02"),
      "",
      "",
    ],
    [
      4,
      "0004",
      "佐藤あかり",
      "サトウアカリ",
      2,
      3,
      "330-0081",
      11,
      "さいたま市中央区新都心8",
      "",
      "048-000-0000",
      "048-000-0000",
      "a_sato@test.co.jp",
      new Date("2012-05-01"),
      "",
      "",
    ],
  ] as const;
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

  const products = [
    [
      1,
      "トマト",
      50,
      new Date("2009-04-01 10:00:00"),
      new Date("2012-06-14 12:00:00"),
    ],
    [
      2,
      "リンゴ",
      150,
      new Date("2010-04-01 10:00:00"),
      new Date("2011-06-01 13:00:00"),
    ],
    [
      3,
      "バナナ",
      300,
      new Date("2011-04-01 10:00:00"),
      new Date("2011-12-01 13:00:00"),
    ],
    [
      4,
      "いちご",
      1000,
      new Date("2012-04-01 10:00:00"),
      new Date("2012-04-01 10:00:00"),
    ],
    [
      5,
      "メロン",
      3000,
      new Date("2012-04-01 10:00:00"),
      new Date("2012-04-01 10:00:00"),
    ],
  ] as const;
  for (const [id, productName, unitPrice, created, modified] of products) {
    await db.product.upsert({
      where: { id },
      update: { id, productName, unitPrice, created, modified },
      create: { id, productName, unitPrice, created, modified },
    });
  }
  console.log("upsert products");

  const sales = [
    [
      1,
      new Date("2009-06-02"),
      1,
      1,
      100,
      new Date("2009-06-02 15:00:00"),
      new Date("2009-06-02 15:00:00"),
    ],
    [
      2,
      new Date("2012-07-02"),
      4,
      2,
      5,
      new Date("2012-07-02 15:00:00"),
      new Date("2012-07-02 15:00:00"),
    ],
    [
      3,
      new Date("2011-04-01"),
      2,
      3,
      10,
      new Date("2011-04-01 15:00:00"),
      new Date("2011-04-01 15:00:00"),
    ],
    [
      4,
      new Date("2012-07-02"),
      1,
      1,
      1000,
      new Date("2012-07-02 16:00:00"),
      new Date("2012-07-02 16:00:00"),
    ],
    [
      5,
      new Date("2012-05-01"),
      3,
      4,
      10,
      new Date("2012-05-01 12:00:00"),
      new Date("2012-05-01 12:00:00"),
    ],
    [
      6,
      new Date("2012-04-02"),
      3,
      5,
      20,
      new Date("2012-05-01 12:00:00"),
      new Date("2012-05-01 12:00:00"),
    ],
  ] as const;
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
