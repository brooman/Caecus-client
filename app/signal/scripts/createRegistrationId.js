export default id => {
  return `
    const registrationId = libsignal.KeyHelper.generateRegistrationId();
    window.ReactNativeWebView.postMessage(JSON.stringify({id: ${id}, type: 'RegistrationId', value: registrationId }));
  `
}
