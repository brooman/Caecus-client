export default (initialKeyId, count) => {
  return `
    ;(() => {
      const keys = []
      let resolved = 0
      for(let i = 0; i < ${count}; i++) {
        let keyId = i + ${initialKeyId}
        libsignal.KeyHelper.generatePreKey(keyId).then(function(preKey) {
          const res = {
            type: 'PreKey',
            value: {
              keyId: preKey.keyId,
              keyPair: { pubKey: ab2str(preKey.keyPair.pubKey), privKey: ab2str(preKey.keyPair.privKey) },
            },
          }
          keys.push(res)

          window.SignalStore.storePreKey(preKey.keyId, preKey.keyPair)

          if (keys.length == ${count}) {
            postMessage(JSON.stringify(keys))
          }
        })
      }

    })()
  `
}
