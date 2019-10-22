import React from 'react'

import { createDatabase } from './app/database'

import Home from './screens/Home'
import Profile from './screens/Profile'
import Conversation from './screens/Conversation'
import NewConversation from './screens/NewConversation'
import AddSender from './screens/AddSender'

import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation'
import { DatabaseContextProvider } from './app/DatabaseContext'

createDatabase()

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
      <AppContainer />
    </DatabaseContextProvider>
  )
}
