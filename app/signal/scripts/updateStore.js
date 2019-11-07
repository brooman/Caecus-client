export default store => {
  return `;(() => {
    window.SignalStore.store = JSON.parse('${store}')
  }();`
}
