import React, { useState, useEffect } from 'react'

import { createDatabase, useDatabase } from './app/database/useDatabase'
import { getContact, recieveMessages, registerRecieved } from './app/network/'
import useSignal from './app/signal/useSignal'
import * as AppStorage from './app/AppStorage'

import Home from './screens/Home'
import Profile from './screens/Profile'
import Conversation from './screens/Conversation'
import NewConversation from './screens/NewConversation'
import Installation from './screens/Installation'

import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation'
import { DatabaseContextProvider } from './app/database/DatabaseContext'
import { SignalContextProvider } from './app/signal/SignalContext'

createDatabase()

const RootStack = createStackNavigator({
  Home: Home,
  Profile: Profile,
  Conversation: Conversation,
  NewConversation: NewConversation,
  Installation: Installation,
})

const AppContainer = createAppContainer(RootStack)

const IncomingMessageHandler = () => {
  const [runId, setRunId] = useState(0)
  const { createMessage, createContact, findContact, findOrCreateConversation } = useDatabase()
  const { decryptMessage } = useSignal()

  const run = () => {
    return new Promise(async (resolve) => {
      const user = await AppStorage.getUser()

      if (user) {
        const incomingMessages = await recieveMessages(user)
        console.log(incomingMessages)

        if (incomingMessages.length > 0) {
          const promises = incomingMessages.map(async (incomingMessage) => {
            let contact = await findContact(incomingMessage.username, incomingMessage.identifier)

            if (!contact) {
              const c = await getContact({
                username: incomingMessage.username,
                identifier: incomingMessage.identifier,
              })

              await createContact(c)
              contact = await findContact(incomingMessage.username, incomingMessage.identifier)
            }

            const conversationId = await findOrCreateConversation(contact.id)
            const decryptedMessage = await decryptMessage(
              incomingMessage.message,
              contact.registrationId,
            )

            return {
              id: incomingMessage.id,
              message: decryptedMessage.message,
              type: 'text',
              date: incomingMessage.date,
              contactId: contact.id,
              conversationId: conversationId,
            }
          })

          Promise.all(promises).then((decryptedMessages) => {
            const handled = decryptedMessages.map((message) => {
              createMessage(message).then(() => {})
              return message.id
            })

            registerRecieved({ messageIds: handled }).then((res) => {})

            resolve(true)
          })
        }
      }

      resolve(false)
    })
  }

  useEffect(() => {
    run().then(() => {
      setTimeout(() => {
        setRunId(runId + 1)
      }, 5000)
    })
  }, [runId])

  return <></>
}

export default () => {
  return (
    <SignalContextProvider>
      <IncomingMessageHandler />
      <DatabaseContextProvider>
        <AppContainer />
      </DatabaseContextProvider>
    </SignalContextProvider>
  )
}
