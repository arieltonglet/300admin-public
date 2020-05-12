import React, { Component } from 'react'
import { AuthConsumer } from '../AuthContext'
import PropTypes from 'prop-types'

import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'

export class Works extends Component {
  state = {
    headers: [
      {
        label: 'ID',
        value: 'id',
      },
      {
        label: 'Artista',
        value: 'artista',
      },
      {
        label: 'Ano',
        value: 'ano',
      },
      {
        label: 'Título',
        value: 'titulo',
      },
      {
        label: 'Formato',
        value: 'formato',
      },
      {
        label: 'Contribuição',
        value: 'cliente',
      },
    ],
  }

  componentDidMount() {
    if (this.props.works === null) {
      console.log('this.props.works: ', this.props.works)
      this.props.loadData()
    }
  }

  getClientName = (work) => {
    const client = this.props.clients.find(
      (c) => c.obras && c.obras.includes(work.id)
    )
    return client ? client.nome : '-'
  }

  render() {
    if (!this.props.works || this.props.works.length === 0) {
      return ''
    }

    return (
      <AuthConsumer>
        {({ user }) =>
          user.id ? (
            <>
              {this.props.works && this.props.availableWorks ? (
                <div className="page-header">
                  <p>
                    <strong>Obras disponíveis:</strong>{' '}
                    {this.props.availableWorks.length}/{this.props.works.length}
                  </p>
                </div>
              ) : (
                ''
              )}
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    {this.state.headers.map((header) => {
                      return <th key={header.label}>{header.label}</th>
                    })}
                  </tr>
                </thead>
                <tbody>
                  {this.props.works &&
                    this.props.works.map((work) => (
                      <tr key={`${work.id}`}>
                        {this.state.headers.map((header) =>
                          header.value !== 'cliente' ? (
                            <td
                              key={`${work.id}${
                                work[header.value]
                              }${Math.random()}`}
                            >
                              {work[header.value] ? work[header.value] : '-'}
                            </td>
                          ) : (
                            <td
                              key={`${work.id}${
                                work[header.value]
                              }${Math.random()}`}
                            >
                              {this.props.clients
                                ? this.getClientName(work)
                                : '-'}
                              <br />
                              <small>
                                {work[header.value] ? work[header.value] : '-'}
                              </small>
                            </td>
                          )
                        )}
                      </tr>
                    ))}
                </tbody>
              </Table>
            </>
          ) : (
            ''
          )
        }
      </AuthConsumer>
    )
  }
}

Works.propTypes = {
  availableWorks: PropTypes.array,
  clients: PropTypes.array,
  loadData: PropTypes.func.isRequired,
  works: PropTypes.array,
}

export default Works
