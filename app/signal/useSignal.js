import React, { useState, useEffect, useRef, useContext } from 'react'
import Config from '../config'
import Scripts from './scripts'
import { SignalContext } from './SignalContext'
import * as Store from './SignalStore'

export default useSignal = () => {
  const { run } = useContext(SignalContext)

  const handle = event => {
    switch (event.type) {
      case 'RegistrationId':
        Store.storeRegistrationId(event.value)
        break
      case 'IdentityKeyPair':
        Store.storeIdentityKeyPair(event.value)
        break
      case 'SignedPreKey':
        Store.storeSignedPreKey(event.value)
        break
      case 'PreKey':
        Store.storePreKey(event.value)
        break
    }
  }

  const createIdentity = () => {
    run(Scripts.createIdentity())
  }

  const createSignedPreKey = keyId => {
    run(Scripts.createSignedPreKey(Store.getIdentityKeyPair(), keyId))
  }

  const createPreKeys = (initialKeyId, count) => {
    run(Scripts.createPreKeys(initialKeyId, count))
  }

  const registerWithServer = async () => {
    const data = {
      username: 'test',
      password: 'secret',
      deviceId: 1,
      identityKey: await Store.getPublicIdentityKey(),
      registrationId: await Store.getRegistrationId(),
      signedPreKey: await Store.getSignedPreKey(false),
      preKeys: await Store.getPreKeys(false),
    }

    console.log(data)
  }

  return {
    handle,
    createIdentity,
    createSignedPreKey,
    createPreKeys,
    registerWithServer,
  }
}
