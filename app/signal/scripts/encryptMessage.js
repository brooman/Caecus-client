export default (msg, registrationId, deviceId) => {
  return `
    ;(() => {
      let signalMessageToAddress = new libsignal.SignalProtocolAddress(${registrationId}, ${deviceId});
      let sessionCipher = new libsignal.SessionCipher(window.SignalStore, signalMessageToAddress);

      sessionCipher.encrypt('${msg}').then((ciphertext) => {
        postMessage({ciphertext: btoa(JSON.stringify(ciphertext))});
      });
    })()
  `
}
