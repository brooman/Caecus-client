export default (ciphertext, fromRecipientId, fromDeviceId) => {
  return `
    ;(() => {
      const address = new libsignal.SignalProtocolAddress(${fromRecipientId}, ${fromDeviceId});
      const sessionCipher = new libsignal.SessionCipher(window.SignalStore, address);
      const ciphertext = JSON.parse(atob('${ciphertext}'))

      if (window.SignalStore.store['session' + address.toString()]) {
        sessionCipher.decryptWhisperMessage(ciphertext.body, 'binary').then((plaintext) => {
          console.log(dcodeIO.ByteBuffer.wrap(plaintext).toString('binary'))
        });
      } else {
        sessionCipher.decryptPreKeyWhisperMessage(ciphertext.body, 'binary').then((plaintext) => {
          console.log(dcodeIO.ByteBuffer.wrap(plaintext).toString('binary'))
        })
      }

    })()
  `
}
