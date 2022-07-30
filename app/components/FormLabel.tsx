import type { ComponentPropsWithoutRef } from "react";

type Props = {
  required?: boolean;
  text: string;
} & ComponentPropsWithoutRef<"label">;
export const FormLabel: React.VFC<Props> = ({ required, text, ...props }) => {
  return (
    <label className="col-form-label text-nowrap" {...props}>
      {required && <span className="text-danger">*</span>}
      {text}
    </label>
  );
};
