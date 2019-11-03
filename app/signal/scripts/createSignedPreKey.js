export default (identityKeyPair, keyId) => {
  return `
    libsignal.KeyHelper.generateSignedPreKey(${identityKeyPair}, ${keyId}).then(function(signedPreKey) {
      const res = JSON.stringify({type: 'SignedPreKey', value: { keyId: signedPreKey.keyId, keyPair: { pubKey: ab2str(signedPreKey.keyPair.pubKey), privKey: ab2str(signedPreKey.keyPair.privKey) }, signature: ab2str(signedPreKey.signature) }})
      window.ReactNativeWebView.postMessage(res);
    });
  `
}
