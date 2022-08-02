import type { ReactNode } from "react";

type Props = { children: ReactNode };
export const FormErrorMessage: React.VFC<Props> = ({ children }) => {
  return (
    <div>
      <input hidden className="is-invalid" />
      <div className="invalid-feedback">{children}</div>
    </div>
  );
};