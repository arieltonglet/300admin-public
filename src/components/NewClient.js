import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { AuthConsumer } from './AuthContext'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'

export class NewClient extends Component {
  state = {
    modalShow: false,
    validated: false,
    client: {
      nome: '',
      email: '',
      numObras: 1,
    },
    submitBtnDisabled: false,
  }

  toggleModal = () => {
    this.setState({ modalShow: !this.state.modalShow })
  }

  handleSubmit = (e, user) => {
    //=====VALIDATING FORM
    e.preventDefault()
    const form = e.currentTarget

    this.setState({ validated: true, submitBtnDisabled: true })
    if (form.checkValidity() === false) {
      e.stopPropagation()
      this.setState({ submitBtnDisabled: false })
      return
    }

    //=====VALIDATE CLIENT DATA
    if (this.state.client.nome.length === 0) {
      alert('Erro no nome do cliente')
      this.setState({ submitBtnDisabled: false })
      return
    }
    if (this.state.client.email.length === 0) {
      alert('Erro no e-mail do cliente')
      this.setState({ submitBtnDisabled: false })
      return
    }
    if (this.state.client.numObras === 0 || this.state.client.numObras > 300) {
      alert('Erro na quantidade de obras')
      this.setState({ submitBtnDisabled: false })
      return
    }

    //=====PUSH TO APP.JS
    const client = {
      ...this.state.client,
      createdAt: new Date(),
    }
    this.props.newClient(client, user)
    this.setState({
      modalShow: false,
      submitBtnDisabled: false,
      validated: false,
      client: {
        nome: '',
        email: '',
        numObras: 1,
      },
    })
  }

  render() {
    return (
      <AuthConsumer>
        {({ user }) => (
          <>
            <Button
              className="my-3"
              variant="primary"
              disabled={
                this.props.availableWorks
                  ? this.props.availableWorks.length === 0
                  : true
              }
              onClick={this.toggleModal}
            >
              Adicionar contribuição
            </Button>
            <Modal
              onHide={this.toggleModal}
              show={this.state.modalShow}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  Adicionar contribuição
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/* START FORM */}
                <Form
                  noValidate
                  validated={this.state.validated}
                  onSubmit={(e) => this.handleSubmit(e, user)}
                >
                  <Form.Group controlId="name">
                    <Form.Label>Participante</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Insira o nome"
                      value={this.state.client.nome}
                      onChange={(e) =>
                        this.setState({
                          client: {
                            ...this.state.client,
                            nome: e.target.value,
                          },
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group controlId="email">
                    <Form.Label>Endereço de e-mail</Form.Label>
                    <Form.Control
                      required
                      type="email"
                      placeholder="Insira o e-mail"
                      value={this.state.client.email}
                      onChange={(e) =>
                        this.setState({
                          client: {
                            ...this.state.client,
                            email: e.target.value,
                          },
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group controlId="quantity">
                    <Form.Label>Número de recompensas</Form.Label>
                    <Form.Control
                      required
                      type="number"
                      min="1"
                      max={
                        this.props.availableWorks
                          ? Math.min(50, this.props.availableWorks.length)
                          : 50
                      }
                      value={this.state.client.numObras}
                      onChange={(e) =>
                        this.setState({
                          client: {
                            ...this.state.client,
                            numObras: e.target.value,
                          },
                        })
                      }
                    />
                  </Form.Group>

                  <Button
                    variant="success"
                    type="submit"
                    disabled={this.props.submitBtnDisabled}
                  >
                    Adicionar
                  </Button>
                </Form>
                {/* END FORM */}
              </Modal.Body>
            </Modal>
          </>
        )}
      </AuthConsumer>
    )
  }
}

NewClient.propTypes = {
  newClient: PropTypes.func.isRequired,
  availableWorks: PropTypes.array,
}

export default NewClient
