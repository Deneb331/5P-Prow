import React from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import logo from "../assets/ProtoLogo_PROW.png";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../contexts/CurrentUserContext";
import Avatar from "./Avatar";
import axios from "axios";
const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  const handleSignOut = async () => {
    try {
      await axios.post("dj-rest-auth/logout/");
      setCurrentUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  const loggedInIcons = (
    <>
      <NavDropdown
        title="Add"
        id="basic-nav-dropdown"
        className={styles.NavDropdown}
      >
        <NavDropdown.Item>
          <NavLink
            className={styles.NavLink}
            to="/create-workspace"
          >
            Workspace
          </NavLink>
        </NavDropdown.Item>
        <NavDropdown.Item>
          <NavLink
            className={styles.NavLink}
            to="/create-board"
          >
            Board
          </NavLink>
        </NavDropdown.Item>
      </NavDropdown>
      <NavDropdown
        title={
          <div className="d-flex align-items-center">
            <span className="ml-2">{currentUser?.username}</span>
            <Avatar src={currentUser?.profile_image} text="" height={40} />
          </div>
        }
        id="basic-nav-dropdown"
        className={styles.NavDropdown}
      >
        <NavDropdown.Item>
          <NavLink
            className={styles.NavLink}
            to={`/profiles/${currentUser?.profile_id}`}
          >
            Edit profile
          </NavLink>
        </NavDropdown.Item>
        <NavDropdown.Item>
          <NavLink className={styles.NavLink} to="/" onClick={handleSignOut}>
            <i className="fas fa-sign-out-alt"></i>Sign out
          </NavLink>
        </NavDropdown.Item>
      </NavDropdown>
    </>
  );
  const loggedOutIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signin"
      >
        <i className="fas fa-sign-in-alt"></i> Sign in
      </NavLink>
      <NavLink
        className={styles.NavLinkAlt}
        activeClassName={styles.Active}
        to="/signup"
      >
        <i className="fas fa-user-plus"></i> Sign up
      </NavLink>
    </>
  );

  return (
    <Navbar className={styles.NavBar} expand="md" fixed="top">
      <Container>
        <NavLink to="/">
          <Navbar.Brand>
            <img src={logo} alt="logo" height="45" />
            <b>PROW</b>
          </Navbar.Brand>
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-left">
            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
