export default () => {
  return `
    ;(() => {
      libsignal.KeyHelper.generateIdentityKeyPair().then(function(identityKeyPair) {
        const res = {
          type: 'IdentityKeyPair',
          value: { pubKey: ab2str(identityKeyPair.pubKey), privKey: ab2str(identityKeyPair.privKey) },
        }
        postMessage(JSON.stringify(res))
        return true
      })
    })()
  `
}
