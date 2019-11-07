export default () => {
  return `
    ;(() => {
      const registrationId = libsignal.KeyHelper.generateRegistrationId()
      postMessage(
        JSON.stringify({ type: 'RegistrationId', value: registrationId }),
      )
    })()
  `
}
