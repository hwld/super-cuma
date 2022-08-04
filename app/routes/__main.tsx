import { Link, Outlet } from "@remix-run/react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { AppLink } from "~/components/AppLink";

export default function Main() {
  return (
    <div>
      <Navbar bg="light" expand="lg" className="mb-3">
        <Container>
          <Navbar.Brand as={Link} to="/customers">
            顧客管理システム
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <AppLink to="/customers">顧客</AppLink>
              <AppLink to="/sales">売上</AppLink>
              <NavDropdown title="データ集計" id="basic-nav-dropdown">
                <NavDropdown.Item href="/datatotals/industry">
                  業種ごとの顧客数
                </NavDropdown.Item>
                <NavDropdown.Item href="/datatotals/ranking">
                  製品別売上ランキング
                </NavDropdown.Item>
                <NavDropdown.Item href="/datatotals">
                  平均客単価
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link>ユーザー</Nav.Link>
              <Nav.Link>ログアウト</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <Outlet />
      </Container>
    </div>
  );
}
