import type { ButtonProps } from "@mui/material";
import { Button } from "@mui/material";
import React from "react";

type Props<T extends React.ElementType> = ButtonProps<T, { component?: T }>;

export const NavButton = <T extends React.ElementType>(props: Props<T>) => {
  return (
    <Button
      sx={{
        color: "inherit",
        ":hover": { backgroundColor: "rgba(255,255,255,0.15)" },
      }}
      variant="text"
      {...props}
    >
      {props.children}
    </Button>
  );
};
