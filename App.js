import React, { useEffect } from 'react'

import useDatabase from './app/database/useDatabase'

import Home from './screens/Home'
import Profile from './screens/Profile'
import Conversation from './screens/Conversation'
import NewConversation from './screens/NewConversation'
import Installation from './screens/Installation'

import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation'
import { DatabaseContextProvider } from './app/database/DatabaseContext'
import { SignalContextProvider } from './app/signal/SignalContext'

const RootStack = createStackNavigator({
  Home: Home,
  Profile: Profile,
  Conversation: Conversation,
  NewConversation: NewConversation,
  Installation: Installation,
})

const AppContainer = createAppContainer(RootStack)

export default () => {
  const { createDatabase } = useDatabase()

  useEffect(() => {
    createDatabase()
  })

  return (
    <SignalContextProvider>
      <DatabaseContextProvider>
        <AppContainer />
      </DatabaseContextProvider>
    </SignalContextProvider>
  )
}
