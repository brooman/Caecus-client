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
  const generateRunId = () => {
    return Math.floor(Date.now() + Math.random().toString())
  }

  const getRegistrationId = async () => {
    return await Store.getRegistrationId()
  }

  const createRegistrationId = async () => {
    const id = generateRunId()
    return await run(Scripts.createRegistrationId(id), id)
  }

  const createIdentity = async () => {
    const id = generateRunId()
    return await run(Scripts.createIdentity(id), id)
  }

  const createSignedPreKey = async keyId => {
    const id = generateRunId()
    return await run(Scripts.createSignedPreKey(await Store.getIdentityKeyPair(id), keyId), id)
  }

  const createPreKeys = async (initialKeyId, count) => {
    const id = generateRunId()
    return await run(Scripts.createPreKeys(id, initialKeyId, count), id)
  }

  const registerWithServer = async username => {
    const data = {
      username: username,
      password: await Store.getPublicIdentityKey(),
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
    createRegistrationId,
    createIdentity,
    createSignedPreKey,
    createPreKeys,
    getRegistrationId,
    registerWithServer,
  }
}
