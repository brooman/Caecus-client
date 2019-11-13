import React, { useContext } from 'react'
import Scripts from './scripts'
import { SignalContext } from './SignalContext'

export default useSignal = () => {
  const { run } = useContext(SignalContext)

  /**
   * Call Signal to generate a RegistrationId
   *
   * @returns {int} RegistrationId
   */
  const createRegistrationId = () => {
    return run(Scripts.createRegistrationId())
  }

  /**
   * Call Signal to generate an IdentityKeyPair
   *
   * @returns {object} IdentityKeyPair
   */
  const createIdentity = () => {
    return run(Scripts.createIdentity())
  }

  /**
   * Call Signal to generate a SignedPreKey
   *
   * @param {object} IdentityKeyPair
   * @param {int} keyId
   *
   * @returns {object} SignedPreKey
   */
  const createSignedPreKey = (identityKeyPair, keyId) => {
    return run(Scripts.createSignedPreKey(identityKeyPair, keyId))
  }

  /**
   * Call Signal to generate `n` PreKeys
   *
   * @param {int} initialKeyId
   * @param {int} count
   *
   * @returns {array} PreKeys
   */
  const createPreKeys = (initialKeyId, count) => {
    return run(Scripts.createPreKeys(initialKeyId, count))
  }

  const startSession = (data) => {
    const { deviceId } = data.user
    const { identity, registrationId, signedPreKey, preKey } = data.preKeyBundle

    return run(Scripts.startSession(identity, registrationId, deviceId, signedPreKey, preKey))
  }

  const encryptMessage = (msg, recieverRegistrationId) => {
    return run(Scripts.encryptMessage(msg, recieverRegistrationId, '1'))
  }

  const decryptMessage = (msg, senderRegistrationId) => {
    return run(Scripts.decryptMessage(msg, senderRegistrationId, '1'))
  }

  return {
    createRegistrationId,
    createIdentity,
    createSignedPreKey,
    createPreKeys,
    startSession,
    encryptMessage,
    decryptMessage,
  }
}
