import React from 'react'

import { createDatabase } from './app/database/database'

import Home from './screens/Home'
import Profile from './screens/Profile'
import Conversation from './screens/Conversation'
import NewConversation from './screens/NewConversation'
import AddSender from './screens/AddSender'

import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation'
import { DatabaseContextProvider } from './app/database/DatabaseContext'
import { SignalContextProvider } from './app/signal/SignalContext'
import useSignal from './app/signal/useSignal'

import * as FileSystem from 'expo-file-system'

createDatabase()

console.log(FileSystem.documentDirectory)

const RootStack = createStackNavigator({
  Home: Home,
  Profile: Profile,
  Conversation: Conversation,
  NewConversation: NewConversation,
  AddSender: AddSender,
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
