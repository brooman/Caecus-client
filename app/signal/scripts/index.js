import createIdentity from './createIdentity'
import createPreKeys from './createPreKeys'
import createRegistrationId from './createRegistrationId'
import createSignedPreKey from './createSignedPreKey'
import startSession from './startSession'
import updateStore from './updateStore'
import encryptMessage from './encryptMessage'
import decryptMessage from './decryptMessage'

const Scripts = {}

Scripts.createIdentity = createIdentity
Scripts.createPreKeys = createPreKeys
Scripts.createRegistrationId = createRegistrationId
Scripts.createSignedPreKey = createSignedPreKey
Scripts.startSession = startSession
Scripts.updateStore = updateStore
Scripts.encryptMessage = encryptMessage
Scripts.decryptMessage = decryptMessage

export default Scripts
