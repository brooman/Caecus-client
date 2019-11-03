const storeRegistrationId = async value => {
  await AsyncStorage.setItem('RegistrationId', JSON.stringify(value))

  return true
}

const storeIdentityKeyPair = async value => {
  await AsyncStorage.setItem('IdentityKeyPair', JSON.stringify(value))

  return true
}

const storeSignedPreKey = async value => {
  await AsyncStorage.setItem('SignedPreKey', JSON.stringify(value))

  return true
}

const storePreKey = async value => {
  const preKeys = JSON.parse(await AsyncStorage.getItem('PreKeys'))

  preKeys.push(value)

  await AsyncStorage.setItem('PreKeys', JSON.stringify(preKeys))

  return true
}

const getPreKeys = async withPrivate => {
  const preKeys = JSON.parse(await AsyncStorage.getItem('PreKeys'))

  if (withPrivate) {
    return preKeys
  } else {
    return JSON.stringify(
      preKeys.map(key => {
        return {
          keyId: key.keyId,
          key: key.keyPair.pubKey,
        }
      }),
    )
  }
}

const getSignedPreKey = async withPrivate => {
  const key = JSON.parse(await AsyncStorage.getItem('SignedPreKey'))

  if (withPrivate) {
    return key
  } else {
    return JSON.stringify({
      keyId: key.keyId,
      key: key.keyPair.pubKey,
      signature: key.signature,
    })
  }
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
  storeSignedPreKey,
  storePreKey,
  getPreKeys,
  getSignedPreKey,
  getRegistrationId,
  getPublicIdentityKey,
  getIdentityKeyPair,
}
