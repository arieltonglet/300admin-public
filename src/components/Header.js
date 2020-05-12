import React, { Component } from 'react'

import { AuthConsumer } from './AuthContext'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { Link } from 'react-router-dom'

export class Header extends Component {
  render() {
    return (
      <AuthConsumer>
        {({ user, logOut }) => (
          <Navbar bg="light" expand="xs">
            <Navbar.Brand>300 admin</Navbar.Brand>
            <Link to="/contributions">Contribuições</Link>
            <Link to="/works">Desenhos</Link>
            <div className="user-area">
              {user.id ? (
                <>
                  <small>user: {user.email}</small>
                  <Button
                    className="ml-3"
                    variant="outline-secondary"
                    onClick={(e) => logOut(e)}
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <Nav.Link href="/">Fazer o login</Nav.Link>
              )}
            </div>
          </Navbar>
        )}
      </AuthConsumer>
    )
  }
}

export default Header
