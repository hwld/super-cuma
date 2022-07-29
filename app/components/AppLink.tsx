import { Link } from "@remix-run/react";
import type { ReactNode } from "react";

export const AppLink: React.VFC<{ children: ReactNode; to: string }> = ({
  children,
  to,
}) => {
  return (
    <Link to={to} className="nav-link">
      {children}
    </Link>
  );
};
