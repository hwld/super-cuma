import type { Breakpoint } from "@mui/material";
import {
  AppBar,
  Box,
  Button,
  Container,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "@remix-run/react";
import { useState } from "react";
import { NavButton } from "./NavButton";

type Props = { maxWidth?: Breakpoint };
export const AppHeader: React.VFC<Props> = ({ maxWidth }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "" }}>
      <Container maxWidth={maxWidth}>
        <Toolbar>
          <Typography
            variant="h5"
            component={Link}
            to="/customers"
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            顧客管理システム
          </Typography>
          <Box
            component="nav"
            sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}
          >
            <Stack component="ul" direction="row" alignItems="center">
              <Box component="li" sx={{ listStyle: "none" }}>
                <NavButton component={Link} to="/customers">
                  顧客
                </NavButton>
              </Box>
              <Box component="li" sx={{ listStyle: "none" }}>
                <NavButton component={Link} to="/sales">
                  売上
                </NavButton>
              </Box>
              <Box component="li" sx={{ listStyle: "none" }}>
                <NavButton onClick={handleClickMenu}>データ集計</NavButton>
              </Box>
              <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
                <MenuItem component={Link} to="/datatotals/industry">
                  業種ごとの顧客数
                </MenuItem>
                <MenuItem component={Link} to="/datatotals/ranking">
                  製品別売上ランキング
                </MenuItem>
                <MenuItem component={Link} to="/datatotals/avg">
                  平均客単価
                </MenuItem>
              </Menu>
              <Box component="li" sx={{ listStyle: "none" }}>
                <NavButton component={Link} to="/users">
                  ユーザー
                </NavButton>
              </Box>
              <Box component="li" sx={{ listStyle: "none" }} marginLeft={1}>
                <form action="/logout" method="post">
                  <Button color="error" type="submit">
                    ログアウト
                  </Button>
                </form>
              </Box>
            </Stack>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
