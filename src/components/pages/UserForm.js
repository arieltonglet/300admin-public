import React, { Component } from 'react'
import { AuthConsumer } from '../AuthContext'

import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Jumbotron from 'react-bootstrap/Jumbotron'

export default class UserForm extends Component {
  emailInput = React.createRef()
  passwordInput = React.createRef()

  redirect = (url) => {
    this.props.history.push(`/${url}`)
  }

  render() {
    return (
      <>
        <AuthConsumer>
          {({ authMessage, logIn, logOut, signUp, user }) => (
            <>
              {!user.id ? (
                <Jumbotron fluid>
                  <Container>
                    <div className="sign-up-wrapper">
                      {authMessage ? <span>{authMessage}</span> : ''}
                      <form className="sign-up-form">
                        <div>
                          <input
                            type="email"
                            ref={this.emailInput}
                            name="email"
                            placeholder="e-mail"
                          ></input>
                        </div>
                        <div>
                          <input
                            type="password"
                            ref={this.passwordInput}
                            name="password"
                            placeholder="password"
                          ></input>
                        </div>
                        <Button
                          onClick={(e) => {
                            logIn(
                              this.emailInput.current.value,
                              this.passwordInput.current.value,
                              e
                            )
                          }}
                        >
                          Login
                        </Button>
                      </form>
                    </div>
                  </Container>
                </Jumbotron>
              ) : (
                <Jumbotron>
                  <Container>
                    <Button
                      onClick={() => {
                        this.redirect('contributions')
                      }}
                    >
                      Ir para Contribuições
                    </Button>
                  </Container>
                </Jumbotron>
              )}
            </>
          )}
        </AuthConsumer>
      </>
    )
  }
}
