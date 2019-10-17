import Home from './screens/Home'
import Profile from './screens/Profile'
import Conversation from './screens/Conversation'

import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation'

const RootStack = createStackNavigator({
  Home: Home,
  Profile: Profile,
  Conversation: Conversation,
})

const AppContainer = createAppContainer(RootStack)

export default AppContainer
