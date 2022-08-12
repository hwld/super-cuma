import { Grid } from "@mui/material";

export const HorizontalFormRow: React.VFC<{
  label?: React.ReactNode;
  input?: React.ReactNode;
}> = ({ label, input }) => {
  return (
    <Grid
      container
      spacing={{ xs: 0, md: 2 }}
      marginBottom={2}
      alignItems="center"
    >
      <Grid item xs={12} md={2} textAlign={{ xs: "start", md: "end" }}>
        {label}
      </Grid>
      <Grid item xs={12} md={10}>
        {input}
      </Grid>
    </Grid>
  );
};
