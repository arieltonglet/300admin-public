import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { clientsRef, db, worksRef } from './Firebase'

import AuthProvider from './components/AuthContext'
import Clients from './components/pages/Clients'
import Header from './components/Header'
import UserForm from './components/pages/UserForm'
import Works from './components/pages/Works'

import Container from 'react-bootstrap/Container'
// import Row from 'react-bootstrap/Row'
// import Col from 'react-bootstrap/Col'
import 'bootstrap/dist/css/bootstrap.min.css'

import './App.css'

export class App extends Component {
  state = {
    availableWorks: null,
    currentWorks: null,
    currentClients: null,
    selectedClient: {},
    modalDetailsShow: false,
  }

  loadData = () => {
    this.setState({
      currentWorks: [],
      currentClients: [],
    })
    this.getWorks()
    this.getClients()
  }

  getWorks = async () => {
    try {
      await worksRef.orderBy('artista').onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const doc = change.doc
          const work = {
            id: doc.id,
            imagem: doc.data().imagem,
            artista: doc.data().artista,
            titulo: doc.data().titulo,
            ano: doc.data().ano,
            tecnica: doc.data().tecnica,
            formato: doc.data().formato,
            observacoes: doc.data().observacoes,
            cliente: doc.data().cliente,
            createdAt: doc.data().createdAt,
          }

          //=====PROPAGATES ON CURRENT AND AVAILABLE LISTS
          switch (change.type) {
            //======ADDING WORK
            case 'added':
              this.setState({
                currentWorks: [...this.state.currentWorks, work],
              })
              break

            //======REMOVING WORK
            case 'removed':
              this.setState({
                currentWorks: this.state.currentWorks.filter(
                  (work) => work.id !== doc.id
                ),
              })
              break

            //======UPDATING WORK
            case 'modified':
              //Current
              const index = this.state.currentWorks.findIndex(
                (item) => item.id === doc.id
              )
              const works = [...this.state.currentWorks]
              works[index] = work
              this.setState({ currentWorks: works })
              break

            default:
              break
          }
        })

        //UPDATE AVAILABLE WORKS
        //If work isnt assigned to a client and isnt locked
        this.setState({
          availableWorks: this.state.currentWorks.filter((w) => {
            return !w.cliente
          }),
        })
      })
    } catch (err) {
      console.error('Error fetching works: ', err)
    }
  }

  getClients = async () => {
    // console.log('get clients')
    try {
      await clientsRef.onSnapshot((snapshot) => {
        // console.log(snapshot)
        snapshot.docChanges().forEach((change) => {
          // console.log('change: ', change.doc.data())
          const doc = change.doc
          const client = {
            id: doc.id,
            nome: doc.data().nome,
            email: doc.data().email,
            obras: doc.data().obras,
            createdAt: doc.data().createdAt,
          }

          switch (change.type) {
            //======ADDING CLIENT
            case 'added':
              this.setState({
                currentClients: [...this.state.currentClients, client],
              })
              break

            //======REMOVING CLIENT
            case 'removed':
              this.setState({
                currentClients: this.state.currentClients.filter(
                  (item) => item.id !== doc.id
                ),
              })
              break

            //======MODIFYING CLIENT
            case 'modified':
              const index = this.state.currentClients.findIndex(
                (item) => item.id === doc.id
              )
              const clients = [...this.state.currentClients]
              clients[index] = client
              this.setState({ currentClients: clients })
              break

            default:
              break
          }
        })
      })
    } catch (err) {
      console.error('Error fetching clients: ', err)
    }
  }

  addClient = async (client, user) => {
    console.log('user: ', user)
    // console.log('new client: ', client)

    //=====CHECK WITH AVAILABLE WORKS
    if (client.numObras > this.state.availableWorks.length) {
      alert('Não há obras suficientes')
      return
    }

    //Create client
    let newClient
    let clientRef
    try {
      clientRef = await clientsRef.add(client)
      newClient = { ...client, id: clientRef.id }

      //Send object to Client.js
      // this.selectClient(client.id)
    } catch (err) {
      console.error('Error adding new client: ', err)
      return
    }
    console.log('newClient: ', newClient)

    //
    //creates a copy of available works
    const tempAvailableWorks = [...this.state.availableWorks]

    //Creates a list of references to the works that will be changed
    let worksArray = []
    let promisesArray = []

    //Draw the works and create references for transaction
    for (let i = 0; i < client.numObras; i++) {
      //Select a random work and remove from temp array of available works
      const randomWork = tempAvailableWorks.splice(
        Math.floor(Math.random() * tempAvailableWorks.length),
        1
      )[0]
      worksArray.push(randomWork)
      const workRef = worksRef.doc(randomWork.id)

      promisesArray.push(
        db.runTransaction((transaction) => {
          // This code may re-run multiple times if there are conflicts.
          return transaction.get(workRef).then((wDoc) => {
            if (!wDoc.exists) {
              throw 'Work does not exist!'
            }

            //Add client id to work, if it's empty
            if (wDoc.data().cliente === validationID) {
              transaction.update(workRef, { cliente: newID })
              return true
            } else {
              return Promise.reject(
                `Work ${wDoc.id} already taken by ${wDoc.data().cliente}`
              )
            }
          })
        })
      )
    }

    //Validate if work is clear and add client ID
    let validationID = ''
    let newID = newClient.id

    Promise.all(promisesArray)
      .then((values) => {
        console.log('Success', values)
        clientRef.update({ obras: worksArray.map((w) => w.id) }).then(() => {
          this.selectClient(newID)
        })
      })
      .catch((err) => {
        console.error(`Error saving works data:`, err)

        //Repeat the Promises
        //Validate if work has this client ID to clear
        validationID = newClient.id
        newID = ''

        const fixPromises = worksArray.map((w) => {
          const fixWorkRef = worksRef.doc(w.id)
          return db.runTransaction((transaction) => {
            // This code may get re-run multiple times if there are conflicts.
            return transaction.get(fixWorkRef).then((wDoc) => {
              if (!wDoc.exists) {
                throw 'Work does not exist!'
              }

              //Add client id to work, if it's empty
              if (wDoc.data().cliente === validationID) {
                transaction.update(fixWorkRef, {
                  cliente: newID,
                  validation: validationID,
                })
                return true
              } else {
                return `Work ${wDoc.id} already taken by ${wDoc.data().cliente}`
              }
            })
          })
        })

        Promise.all(fixPromises)
          .then(function (values) {
            console.log(values)
          })
          .catch((err) => {
            console.error(`Error fixing works data:`, err)
          })

        //Delete client atempt
        clientRef.delete()
        //Closes card
        this.toggleDetailsCard()
      })
  }

  selectClient = (clientID) => {
    const client = this.state.currentClients.find((c) => c.id === clientID)
    if (client && client.obras) {
      client.listaObras = client.obras.map((o) =>
        this.state.currentWorks.find((w) => w.id === o)
      )
    }
    // console.log(client)
    this.setState({
      selectedClient: { ...client },
    })
  }

  deleteClient = async (client) => {
    //Check if client has works.
    let obras =
      client.obras && client.obras.length > 0
        ? client.obras
        : this.state.currentWorks
            .filter((w) => w.cliente === client.id)
            .map((w) => w.id)
    console.log('obras: ', obras)

    //Updates works with generated client id
    obras.forEach(async (workID) => {
      await worksRef
        .doc(workID)
        .update({
          cliente: '',
          validation: client.id,
        })
        .then(() => {
          console.log('Updated work with id:', workID)
        })
        .catch((err) => {
          console.error(`Error updating work data with id ${workID}`, err)
          alert(
            `Erro ao gravar informações!
  Não feche esta página e avise o administrador do sistema o mais breve possível
  Obra ID: ${workID}`
          )
          return
        })
    })
    const clientRef = await clientsRef.doc(client.id)
    clientRef.delete()
  }

  editClient = async (clientID, clientObj) => {
    const clientRef = await clientsRef.doc(clientID)
    await clientRef
      .update({ ...clientObj })
      .then(() => {
        console.log('Updated client with id:', clientID)
      })
      .catch((err) => {
        console.error('Error updating work data', err)
        alert('Erro ao atualizar os dados do cliente')
        return
      })
  }

  toggleDetailsCard = () => {
    //se está fechando
    if (this.state.modalDetailsShow === true) {
      this.selectClient(null)
    }
    this.setState({ modalDetailsShow: !this.state.modalDetailsShow })
  }

  render() {
    return (
      <>
        <BrowserRouter>
          <AuthProvider>
            <Container fluid="xl">
              <Header />
              <Switch>
                <Route
                  exact
                  path="/"
                  render={(props) => (
                    <UserForm {...props} loadData={this.loadData}></UserForm>
                  )}
                ></Route>
                <Route
                  exact
                  path="/works"
                  render={(props) => (
                    <Works
                      {...props}
                      loadData={this.loadData}
                      clients={this.state.currentClients}
                      works={this.state.currentWorks}
                      availableWorks={this.state.availableWorks}
                    />
                  )}
                />
                <Route
                  exact
                  path="/contributions"
                  render={(props) => (
                    <Clients
                      {...props}
                      loadData={this.loadData}
                      clients={this.state.currentClients}
                      addClient={this.addClient}
                      availableWorks={this.state.availableWorks}
                      selectClient={this.selectClient}
                      editClient={this.editClient}
                      deleteClient={this.deleteClient}
                      selectedClient={this.state.selectedClient}
                      modalDetailsShow={this.state.modalDetailsShow}
                      toggleDetailsCard={this.toggleDetailsCard}
                    />
                  )}
                />
              </Switch>
            </Container>
          </AuthProvider>
        </BrowserRouter>
      </>
    )
  }
}

export default App
