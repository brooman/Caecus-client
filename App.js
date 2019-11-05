import React, { useState } from 'react'

import { createDatabase } from './app/database/database'

import * as FileSystem from 'expo-file-system'

import Home from './screens/Home'
import Profile from './screens/Profile'
import Conversation from './screens/Conversation'
import NewConversation from './screens/NewConversation'
import NewContact from './screens/NewContact'
import Installation from './screens/Installation'

import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation'
import { DatabaseContextProvider } from './app/database/DatabaseContext'
import { SignalContextProvider } from './app/signal/SignalContext'

createDatabase()

console.log(FileSystem.documentDirectory)

const RootStack = createStackNavigator({
  Home: Home,
  Profile: Profile,
  Conversation: Conversation,
  NewConversation: NewConversation,
  NewContact: NewContact,
  Installation: Installation,
})

const AppContainer = createAppContainer(RootStack)

export default () => {
  return (
    <DatabaseContextProvider>
      <SignalContextProvider>
        <AppContainer />
      </SignalContextProvider>
    </DatabaseContextProvider>
  )
}
