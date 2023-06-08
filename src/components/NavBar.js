import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import logo from "../assets/ProtoLogo_PROW.png";
import styles from "../styles/NavBar.module.css"

const NavBar = () => {
  return (
    <Navbar className={styles.NavBar} expand="md" fixed="top">
      <Container>
        <Navbar.Brand>
          <img src={logo} alt="logo" height="45" />
          <b>PROW</b>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-left">
            <Nav.Link className={styles.NavLink}>
              <i className="fas fa-sign-in-alt"></i> Sign in
            </Nav.Link>
            <Nav.Link className={styles.NavLinkAlt}>
              <i className="fas fa-user-plus"></i> Sign up
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
