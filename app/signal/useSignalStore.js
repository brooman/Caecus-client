import { AsyncStorage } from 'react-native'
import { useDatabase } from '../database/useDatabase'

export default useSignalStore = () => {
  const { storePreKey } = useDatabase()

  const saveInMemoryStore = async (value) => {
    await AsyncStorage.setItem('_store', value)

    return true
  }

  const getInMemoryStore = async () => {
    return await AsyncStorage.getItem('_store')
  }

  const storeRegistrationId = async (value) => {
    await AsyncStorage.setItem('RegistrationId', JSON.stringify(value))

    return true
  }

  const storeIdentityKeyPair = async (value) => {
    await AsyncStorage.setItem('IdentityKeyPair', JSON.stringify(value))

    return true
  }

  const getRegistrationId = async () => {
    const regid = await AsyncStorage.getItem('RegistrationId')
    return JSON.parse(regid)
  }

  const getPublicIdentityKey = async () => {
    const identity = await AsyncStorage.getItem('IdentityKeyPair')
    return JSON.parse(identity.keyPair.pubKey)
  }

  const getIdentityKeyPair = async () => {
    return await AsyncStorage.getItem('IdentityKeyPair')
  }

  const storePreKeys = (preKeys) => {
    const pkeys = JSON.parse(preKeys)
    pkeys.map((key) => {
      storePreKey({
        keyId: key.value.keyId,
        pubKey: key.value.keyPair.pubKey,
        privKey: key.value.keyPair.privKey,
      })
    })

    return true
  }

  const getPreKey = () => {}

  const deletePreKey = (keyId) => {}

  return {
    saveInMemoryStore,
    getInMemoryStore,
    storeRegistrationId,
    storeIdentityKeyPair,
    storePreKeys,
    getRegistrationId,
    getPublicIdentityKey,
    getIdentityKeyPair,
    getPreKey,
    deletePreKey,
  }
}
