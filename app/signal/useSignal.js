import React, { useState, useEffect, useRef, useContext } from 'react'
import Config from '../config'
import Scripts from './scripts'
import { SignalContext } from './SignalContext'
import * as Store from './SignalStore'

export default useSignal = () => {
  const { run } = useContext(SignalContext)

  /**
   * Get the registration id from storage
   */
  const getRegistrationId = async () => {
    return await Store.getRegistrationId()
  }

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

  const startSession = res => {
    const { username, identifier, deviceId } = res.user
    const { identity, registrationId, signedPreKey, preKey } = res.preKeyBundle

    return run(Scripts.startSession(identity, registrationId, deviceId, signedPreKey, preKey))
  }

  return {
    createRegistrationId,
    createIdentity,
    createSignedPreKey,
    createPreKeys,
    getRegistrationId,
    startSession,
  }
}
