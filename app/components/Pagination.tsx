import { useLocation } from "@remix-run/react";
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
    <nav aria-label="Page navigation example">
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <a className="page-link" href={page(1)} aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        {[...new Array(allPages).keys()].map((i) => {
          const p = i + 1;
          return (
            <li className="page-item" key={p}>
              <a
                className={`page-link ${p === currentPage ? "active" : ""}`}
                href={page(p)}
              >
                {p}
              </a>
            </li>
          );
        })}
        <li
          className={`page-item ${currentPage === allPages ? "disabled" : ""}`}
        >
          <a className="page-link" href={page(allPages)} aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};
