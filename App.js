import React, { useEffect } from 'react'

import { createDatabase, useDatabase } from './app/database/useDatabase'
import { getContact } from './app/network/'
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

export default () => {
  const { findContact, findOrCreateConversation } = useDatabase()

  useEffect(() => {
    setInterval(() => {
      AppStorage.getUser().then((user) => {
        if (user && user.name && user.identifier) {
          const data = {
            username: user.name,
            identifier: user.identifier,
          }

          recieveMessages(data).then((messages) => {
            const promises = messages.map(async (message) => {
              let { contactId } = await findContact(message.username, message.identifier)

              if (!contactId) {
                const contact = await createContact(
                  await getContact(message.username, message.identifier),
                )
                contactId = contact.id
              }

              const { conversationId } = await findOrCreateConversation(contactId)

              return {
                message: await decryptMessage(message.message),
                type: 'text',
                date: message.date,
                contactId: contactId,
                conversationId: conversationId,
              }
            })

            Promise.all(promises).then((decryptedMessages) => {
              decryptedMessages.map((message) => {
                createMessage(message)
              })
            })
          })
        }
      })
    }, 30000)
  }, [])

  return (
    <SignalContextProvider>
      <DatabaseContextProvider>
        <AppContainer />
      </DatabaseContextProvider>
    </SignalContextProvider>
  )
}
