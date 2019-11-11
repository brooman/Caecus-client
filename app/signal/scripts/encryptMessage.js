export default (msg, registrationId) => {
  return `
    ;(() => {
      let signalMessageToAddress = new ls.SignalProtocolAddress(${registrationId}, '1');
      let sessionCipher = new ls.SessionCipher(store, signalMessageToAddress);

      sessionCipher.encrypt('${msg}').then(function(ciphertext) {
        // ciphertext -> { type: <Number>, body: <string> }
        postMessage({to: signalMessageToAddress.toString(), type: ciphertext.type, body: ciphertext.body});
    });
    })()
  `
}
