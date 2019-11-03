export default () => {
  return `
    ;(() => {
      const registrationId = libsignal.KeyHelper.generateRegistrationId()
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: 'RegistrationId', value: registrationId }),
      )
    })()
  `
}
