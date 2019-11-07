export default (registrationId, deviceId, preKeyBundle) => {
  return `
    ;(() => {
      const address = new libsignal.SignalProtocolAddress(${registrationId}, ${deviceId});
      const sessionBuilder = new libsignal.SessionBuilder(store, address);

      const preKeyBundle = JSON.parse('${preKeyBundle}')

      const promise = sessionBuilder.processPreKey({
        registrationId: ${registrationId},
        identityKey: preKeyBundle.identity,
        signedPreKey: {
            keyId     : preKeyBundle.signedPreKey.keyId
            publicKey : str2ab(preKeyBundle.signedPreKey.key),
            signature : str2ab(preKeyBundle.signedPreKey.signature)
        },
        preKey: {
            keyId     : preKeyBundle.preKey.keyId,
            publicKey : str2ab(preKeyBundle.preKey.key)
        }
      })

      promise.then(() => {
        //encrypt messages
      })

    })()
  `
}
