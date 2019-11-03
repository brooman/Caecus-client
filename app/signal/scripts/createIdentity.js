export default id => {
  return `
    libsignal.KeyHelper.generateIdentityKeyPair().then(function(identityKeyPair) {
        const res = JSON.stringify({id: ${id}, type: 'IdentityKeyPair', value: { pubKey: ab2str(identityKeyPair.pubKey), privKey: ab2str(identityKeyPair.privKey) }})
        window.ReactNativeWebView.postMessage(res);
        return true
    });
  `
}
