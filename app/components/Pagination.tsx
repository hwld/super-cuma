import { Pagination as MuiPagination, PaginationItem } from "@mui/material";
import { Link, useLocation } from "@remix-run/react";
import { useCallback, useMemo } from "react";

type Props = { allPages: number };
export const Pagination: React.VFC<Props> = ({ allPages }) => {
  const { search: searchParam } = useLocation();

  const existsPageQuery = useMemo(() => {
    return /[&?]page=/.test(searchParam);
  }, [searchParam]);

  const currentPage = useMemo(() => {
    if (existsPageQuery) {
      const foundedPage = searchParam.match(/(?<=[&?]page=)[^&]*/g);
      if (!foundedPage) {
        return 1;
      }
      const page = Number(foundedPage[0]);
      if (isNaN(page)) {
        return 1;
      }

      return page;
    }
    return 1;
  }, [existsPageQuery, searchParam]);

  const page = useCallback(
    (target: number | "first" | "last") => {
      //　ページクエリが存在すれば数値を書き換える
      if (existsPageQuery) {
        return searchParam.replace(/(?<=[&?]page=)[^&]*/g, target.toString());
      }

      return searchParam === ""
        ? `?page=${target}`
        : `${searchParam}&page=${target}`;
    },
    [existsPageQuery, searchParam]
  );

  return (
    <MuiPagination
      size="large"
      showFirstButton
      showLastButton
      count={allPages}
      defaultPage={currentPage}
      renderItem={(item) => {
        if (item.page === null) {
          return <PaginationItem {...item} />;
        }
        return (
          <PaginationItem {...item} component={Link} to={page(item.page)} />
        );
      }}
    />
  );
};
