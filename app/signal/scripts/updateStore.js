export default store => {
  return `;(() => {
    window.SignalStore.store = formatInput(JSON.parse(atob('${store}')))
  })();`
}
