import { useSearchParams } from "@remix-run/react";
import { useCallback } from "react";

export type CustomerTableSortState = { orderBy: string; order: "asc" | "desc" };

type UseSortCustomerStateArgs = { defaultValue?: CustomerTableSortState };
export const useSortCustomerState = ({
  defaultValue = { orderBy: "", order: "asc" },
}: UseSortCustomerStateArgs) => {
  const [search, setSearch] = useSearchParams();

  const setSearchParam = useCallback(
    (state: CustomerTableSortState) => {
      // orderBy,order,pageをクエリから削除する
      // pageはページングのために使用するもので、ソートと関係ない場所で使用しているため、あまり変更したくはなかった。
      // 将来的にはsortとページングを一つのフックにまとめるのが良さそう。
      const removedSearch = search
        .toString()
        .replace(/&?(orderBy|order|page)=[^&]*/g, "");

      let newSearchParam = `${removedSearch}&orderBy=${state.orderBy}&order=${state.order}`;

      //先頭の&を削除する
      newSearchParam = newSearchParam.replace(/^&/, "");
      setSearch(newSearchParam);
    },
    [search, setSearch]
  );

  const orderBy = search.get("orderBy");
  const order = search.get("order");

  if (
    orderBy === null ||
    order === null ||
    (order !== "asc" && order !== "desc")
  ) {
    return [defaultValue, setSearchParam] as const;
  }

  return [{ orderBy, order }, setSearchParam] as const;
};
