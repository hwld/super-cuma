import { createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";

export const theme = createTheme({
  palette: {
    background: { default: grey[200], paper: grey[100] },
  },
  components: { MuiButton: { defaultProps: { variant: "contained" } } },
});
