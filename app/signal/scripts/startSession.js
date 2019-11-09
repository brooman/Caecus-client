export default (identity, registrationId, deviceId, signedPreKey, preKey) => {
  return `
    ;(() => {
      const address = new libsignal.SignalProtocolAddress(${registrationId}, ${deviceId});
      const sessionBuilder = new libsignal.SessionBuilder(window.SignalStore, address);

      const signedPreKey = JSON.parse('${JSON.stringify(signedPreKey)}')
      const preKey = JSON.parse('${JSON.stringify(preKey)}')

      const promise = sessionBuilder.processPreKey({
        registrationId: ${registrationId},
        identityKey: str2ab('${identity}'),
        signedPreKey: {
            keyId     : signedPreKey.keyId,
            publicKey : str2ab(signedPreKey.key),
            signature : str2ab(signedPreKey.signature)
        },
        preKey: {
            keyId     : preKey.keyId,
            publicKey : str2ab(preKey.key)
        }
      })

      promise.then(() => {
        postMessage({type: 'StartSession', value: address})
      })

    })()
  `
}
