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

export {
  storeRegistrationId,
  storeIdentityKeyPair,
  getRegistrationId,
  getPublicIdentityKey,
  getIdentityKeyPair,
}
