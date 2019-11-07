import { AsyncStorage } from 'react-native'
import { database } from '../database/database'

const saveInMemoryStore = async value => {
  await AsyncStorage.setItem('_store', value)
}

const getInMemoryStore = async () => {
  return await AsyncStorage.getItem('_store')
}

const storeRegistrationId = async value => {
  await AsyncStorage.setItem('RegistrationId', JSON.stringify(value))

  return true
}

const storeIdentityKeyPair = async value => {
  await AsyncStorage.setItem('IdentityKeyPair', JSON.stringify(value))

  return true
}

const getRegistrationId = async () => {
  return JSON.parse(await AsyncStorage.getItem('RegistrationId'))
}

const getPublicIdentityKey = async () => {
  const identity = await AsyncStorage.getItem('IdentityKeyPair')
  return JSON.parse(identity.keyPair.pubKey)
}

const getIdentityKeyPair = async () => {
  return await AsyncStorage.getItem('IdentityKeyPair')
}

const storePreKeys = preKeys => {
  const pkeys = JSON.parse(preKeys)
  const formatted = pkeys.map(key => {
    return {
      keyId: key.value.keyId,
      pubKey: key.value.keyPair.pubKey,
      privKey: key.value.keyPair.privKey,
    }
  })

  database.transaction(
    tx => {
      formatted.map(item => {
        tx.executeSql(
          `INSERT INTO preKeys (keyId, publicKey, privateKey) VALUES (?, ?, ?)`,
          [item.keyId, item.pubKey, item.privKey],
          null,
        )
      })
    },
    e => console.log(e),
  )

  return true
}

const getPreKey = () => {}

const deletePreKey = keyId => {}

export {
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
