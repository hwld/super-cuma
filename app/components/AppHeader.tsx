import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import type { Breakpoint } from "@mui/material";
import {
  AppBar,
  Box,
  Button,
  Container,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "@remix-run/react";
import { useState } from "react";

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
    <AppBar position="static">
      <Container maxWidth={maxWidth}>
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/customers"
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            顧客管理システム
          </Typography>
          <Box
            sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}
          >
            <Button sx={{ color: "white" }} component={Link} to="/customers">
              顧客
            </Button>
            <Button sx={{ color: "white" }} component={Link} to="/sales">
              売上
            </Button>
            <Button sx={{ color: "white" }} onClick={handleClickMenu}>
              データ集計
              <ArrowDropDownIcon />
            </Button>
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
            <Button sx={{ color: "white" }} component={Link} to="/users">
              ユーザー
            </Button>
            <form action="/logout" method="post">
              <Button sx={{ color: "white" }} type="submit">
                ログアウト
              </Button>
            </form>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
