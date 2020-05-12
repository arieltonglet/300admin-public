import React, { Component } from 'react'
import { AuthConsumer } from '../AuthContext'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Table from 'react-bootstrap/Table'
import Spinner from 'react-bootstrap/Spinner'
import PropTypes from 'prop-types'

import ClientCard from '../ClientCard'
import NewClient from '../NewClient'

export class Clients extends Component {
  state = {
    enableEdition: false,
    validated: false,
    headers: [
      {
        label: 'ID',
        value: 'id',
      },
      {
        label: 'Participante',
        value: 'nome',
      },
      {
        label: 'E-mail',
        value: 'email',
      },
      {
        label: 'Número de obras',
        value: 'obras',
      },
    ],
  }

  componentDidMount() {
    if (this.props.clients === null) {
      console.log('this.props.clients: ', this.props.clients)
      this.props.loadData()
    }
  }

  sendNewClient = (client, user) => {
    this.props.toggleDetailsCard()

    this.props.addClient(client, user)
  }

  render() {
    const mountRow = (client, header) => {
      if (header.value === 'obras' && client[header.value]) {
        return client[header.value].length
      } else {
        return client[header.value] || '-'
      }
    }

    return (
      <AuthConsumer>
        {({ user }) =>
          user.id && this.props.clients ? (
            <>
              <div className="page-header">
                <NewClient
                  newClient={this.sendNewClient}
                  availableWorks={this.props.availableWorks}
                />
              </div>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    {this.state.headers.map((header) => {
                      return <th key={header.label}>{header.label}</th>
                    })}
                  </tr>
                </thead>
                <tbody>
                  {this.props.clients.map((client) => (
                    <tr
                      key={client.id}
                      onClick={() => {
                        this.props.selectClient(client.id)
                        this.props.toggleDetailsCard()
                      }}
                    >
                      {this.state.headers.map((header) => (
                        <td key={`${client.id}${client[header.value]}`}>
                          {mountRow(client, header)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
              <ClientCard
                editClient={this.props.editClient}
                deleteClient={this.props.deleteClient}
                selectedClient={this.props.selectedClient}
                toggleDetailsCard={this.props.toggleDetailsCard}
                modalDetailsShow={this.props.modalDetailsShow}
              />
            </>
          ) : (
            ''
          )
        }
      </AuthConsumer>
    )
  }
}

Clients.propTypes = {
  loadData: PropTypes.func.isRequired,
  clients: PropTypes.array,
  addClient: PropTypes.func.isRequired,
  availableWorks: PropTypes.array,
  editClient: PropTypes.func.isRequired,
  deleteClient: PropTypes.func.isRequired,
  selectClient: PropTypes.func.isRequired,
  selectedClient: PropTypes.object,
  toggleDetailsCard: PropTypes.func.isRequired,
  modalDetailsShow: PropTypes.bool.isRequired,
}

export default Clients
