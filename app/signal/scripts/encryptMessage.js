export default (msg, to) => {
  return `
    ;(() => {
      let requestObject = {
        messageTo: {
            registrationId: messageToObject.preKeyObject.registrationId,
            deviceId: messageToObject.deviceId
        },
        messageFrom: {
            registrationId: window.SignalStore.get('registrationId'),
            deviceId: '1'
        },
        ciphertextMessage: 'Invalid ciphertext',
    };

      let signalMessageToAddress = new ls.SignalProtocolAddress(requestObject.messageTo.registrationId,requestObject.messageTo.deviceId);
      let sessionCipher = new ls.SessionCipher(store, signalMessageToAddress);

      sessionCipher.encrypt('${msg}').then(function(ciphertext) {
        // ciphertext -> { type: <Number>, body: <string> }
        postMessage({to: signalMessageToAddress.toString(), type: ciphertext.type, body: ciphertext.body});
    });
    })()
  `
}
