export default () => {
  return `
    ;(() => {
      const registrationId = libsignal.KeyHelper.generateRegistrationId()
      window.SignalStore.put('registrationId', registrationId)
      postMessage(
        JSON.stringify({ type: 'RegistrationId', value: registrationId }),
      )
    })()
  `
}
