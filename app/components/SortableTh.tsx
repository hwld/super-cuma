import { useMemo } from "react";
import { HiChevronDown, HiChevronUp, HiSelector } from "react-icons/hi";
import type { CustomerTableSortState } from "~/libs/useSortCustomerState";

type Props = {
  children: React.ReactNode;
  field: string;
  sortState: CustomerTableSortState;
  setSortState: (value: CustomerTableSortState) => void;
};
export const SortableTh: React.VFC<Props> = ({
  children,
  sortState,
  field,
  setSortState,
}) => {
  const handleClick = () => {
    if (sortState.orderBy === field) {
      setSortState({
        ...sortState,
        order: sortState.order === "asc" ? "desc" : "asc",
      });
    } else {
      setSortState({ orderBy: field, order: "asc" });
    }
  };

  const icon = useMemo(() => {
    if (sortState.orderBy !== field) {
      return <HiSelector />;
    }
    if (sortState.order === "asc") {
      return <HiChevronUp />;
    }
    if (sortState.order === "desc") {
      return <HiChevronDown />;
    }
    return <HiSelector />;
  }, [field, sortState.orderBy, sortState.order]);

  return (
    <th style={{ cursor: "pointer" }} onClick={handleClick}>
      <div className="d-flex justify-content-between align-items-center">
        <div className="text-nowrap user-select-none">{children}</div>
        {icon}
      </div>
    </th>
  );
};
