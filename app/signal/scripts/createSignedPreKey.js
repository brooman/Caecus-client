export default (identityKeyPair, keyId) => {
  return `
    ;(() => {
      let ikp = JSON.parse('${identityKeyPair}')
      let identity = {
        pubKey: str2ab(ikp.value.pubKey),
        privKey: str2ab(ikp.value.privKey)
      }

      libsignal.KeyHelper.generateSignedPreKey(identity, 213).then(function(signedPreKey) {
        const res = JSON.stringify({
          type: 'SignedPreKey',
          value: {
            keyId: signedPreKey.keyId,
            keyPair: {
              pubKey: ab2str(signedPreKey.keyPair.pubKey),
              privKey: ab2str(signedPreKey.keyPair.privKey),
            },
            signature: ab2str(signedPreKey.signature),
          }
        })

        window.ReactNativeWebView.postMessage(res);
        return true
      });

    })()
  `
}
