import { Typography } from "@mui/material";
import type { ReactNode } from "react";

type Props = { children: ReactNode };
export const FormErrorMessage: React.VFC<Props> = ({ children }) => {
  return (
    <Typography color="error" fontSize={16}>
      {children}
    </Typography>
  );
};
