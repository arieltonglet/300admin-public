import React from 'react'
import { firebaseAuth } from '../Firebase'
import { withRouter } from 'react-router-dom'

const AuthContext = React.createContext()

class AuthProvider extends React.Component {
  state = {
    user: {},
    authMessage: '',
  }

  componentDidMount() {
    firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          user: {
            id: user.uid,
            email: user.email,
          },
          authMessage: '',
        })
      } else {
        this.setState({ user: {} })
      }
    })
  }

  logIn = async (email, password, e) => {
    try {
      e.preventDefault()
      await firebaseAuth.signInWithEmailAndPassword(email, password)
      this.props.history.push(`/contributions`)
      // console.log('logged in')
    } catch (err) {
      console.error('Error logging in', err.message)
      this.setState({ authMessage: err.message })
    }
  }

  logOut = async (e) => {
    try {
      e.preventDefault()
      await firebaseAuth.signOut()
      this.setState({ user: {} })
      this.props.history.push('/')
      // console.log('Signed out')
    } catch (err) {
      console.error('Error logging in', err.message)
      this.setState({ authMessage: err.message })
    }
  }

  render() {
    return (
      <AuthContext.Provider
        value={{
          user: this.state.user,
          signUp: this.signUp,
          logIn: this.logIn,
          logOut: this.logOut,
          authMessage: this.state.authMessage,
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    )
  }
}

const AuthConsumer = AuthContext.Consumer
export default withRouter(AuthProvider)
export { AuthConsumer }
