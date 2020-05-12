import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { AuthConsumer } from './AuthContext'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'

import './ClientCard.css'

export class ClientCard extends Component {
  state = {
    client: {},
    enableEdit: false,
    validated: false,
    submitBtnDisabled: false,
  }

  mountURL = (workID) => {
    return `http://www.300desenhos.art/${workID}?d`
  }

  handleSubmit = (e) => {
    // this.props.toggleDetailsCard()

    //=====VALIDATING FORM
    e.preventDefault()
    const form = e.currentTarget

    this.setState({
      validated: true,
      submitBtnDisabled: true,
      enableEdit: false,
    })
    if (form.checkValidity() === false) {
      e.stopPropagation()
      this.setState({ submitBtnDisabled: false })
      return
    }

    //=====PUSH TO APP.JS
    const clientID = this.props.selectedClient.id
    console.log('Edit client:', clientID, this.state.client)
    this.props.editClient(clientID, this.state.client)
    this.setState({
      submitBtnDisabled: false,
      validated: false,
      enableEdit: false,
    })
  }

  render() {
    return (
      <AuthConsumer>
        {({ user }) => (
          <>
            <Modal
              onHide={this.props.toggleDetailsCard}
              show={this.props.modalDetailsShow}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  Detalhes da contribuição
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {!this.props.selectedClient.nome ? (
                  <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                ) : (
                  <>
                    <div>
                      <Form
                        noValidate
                        validated={this.state.validated}
                        onSubmit={(e) => this.handleSubmit(e)}
                      >
                        <Form.Group>
                          <Form.Check
                            type="switch"
                            id="eidt-switch"
                            label="Editar"
                            checked={this.state.enableEdit}
                            onClick={(e) =>
                              this.setState({
                                enableEdit: !this.state.enableEdit,
                                client: {},
                              })
                            }
                          />
                        </Form.Group>
                        <Form.Group controlId="name">
                          <Form.Label>Participante</Form.Label>
                          <Form.Control
                            required
                            disabled={!this.state.enableEdit}
                            type="text"
                            placeholder="Insira o nome"
                            defaultValue={this.props.selectedClient.nome}
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
                            disabled={!this.state.enableEdit}
                            type="email"
                            placeholder="Insira o e-mail"
                            defaultValue={this.props.selectedClient.email}
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
                        <Button
                          className="mb-3"
                          variant="warning"
                          type="submit"
                          disabled={!this.state.enableEdit}
                          style={{
                            visibility: !this.state.enableEdit
                              ? 'hidden'
                              : 'visible',
                          }}
                        >
                          Editar
                        </Button>
                      </Form>

                      <Tabs defaultActiveKey="list-links">
                        {/* TAB WITH WORKS NAMES */}
                        <Tab eventKey="list-works" title="Desenhos">
                          <ul className="my-3">
                            {this.props.selectedClient.listaObras &&
                              this.props.selectedClient.listaObras.length > 0 &&
                              this.props.selectedClient.listaObras.map((o) => (
                                <li
                                  key={o.id}
                                >{`“${o.titulo}” – ${o.artista}`}</li>
                              ))}
                          </ul>
                        </Tab>

                        {/* TAB WITH WORKS LINKS */}
                        <Tab eventKey="list-links" title="Links">
                          <ul className="my-3">
                            {this.props.selectedClient.obras &&
                              this.props.selectedClient.obras.length > 0 &&
                              this.props.selectedClient.obras.map((o) => (
                                <li key={o}>{this.mountURL(o)}</li>
                              ))}
                          </ul>
                        </Tab>

                        {/* TAB WITH DELETE FIELDS */}
                        <Tab eventKey="list-delete" title="Excluir">
                          <div className="my-5">
                            <Form
                              noValidate
                              validated={this.state.validated}
                              onSubmit={(e) => {
                                e.preventDefault()
                                this.props.toggleDetailsCard()
                                this.props.deleteClient(
                                  this.props.selectedClient
                                )
                              }}
                            >
                              <Form.Group controlId="name">
                                <Form.Label>Confirme o nome</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  placeholder="Insira o nome"
                                  value={this.state.checkDeleteName}
                                  onChange={(e) =>
                                    this.setState({
                                      checkDeleteName: e.target.value,
                                    })
                                  }
                                />
                              </Form.Group>
                              <Button
                                variant="danger"
                                type="submit"
                                disabled={
                                  this.props.selectedClient.nome !==
                                  this.state.checkDeleteName
                                }
                              >
                                Excluir contribuição
                              </Button>
                            </Form>
                          </div>
                        </Tab>
                      </Tabs>
                    </div>
                  </>
                )}
              </Modal.Body>
            </Modal>
          </>
        )}
      </AuthConsumer>
    )
  }
}

ClientCard.propTypes = {
  editClient: PropTypes.func.isRequired,
  deleteClient: PropTypes.func.isRequired,
  selectedClient: PropTypes.object.isRequired,
}

export default ClientCard
