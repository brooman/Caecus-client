import { AsyncStorage } from 'react-native'

const storeAccessToken = async accessToken => {
  await AsyncStorage.setItem('@AccessToken', JSON.stringify(accessToken))
  return true
}

const getAccessToken = () => {
  return AsyncStorage.getItem('@AccessToken')
}

const storeUser = async user => {
  await AsyncStorage.setItem('@User', JSON.stringify(user))
  return true
}

const getUser = () => {
  return AsyncStorage.getItem('@User')
}

export { storeAccessToken, getAccessToken, storeUser, getUser }
