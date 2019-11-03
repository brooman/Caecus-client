export default (id, initialKeyId, count) => {
  return `
    for(let i = 0; i < ${count}; i++) {
      let keyId = i + ${initialKeyId}
      libsignal.KeyHelper.generatePreKey(keyId).then(function(preKey) {
        const res = JSON.stringify({id: ${id}, type: 'PreKey', value: { keyId: preKey.keyId, keyPair: { pubKey: ab2str(preKey.keyPair.pubKey), privKey: ab2str(preKey.keyPair.privKey) } }})
        window.ReactNativeWebView.postMessage(res);
      });
    }
  `
}
