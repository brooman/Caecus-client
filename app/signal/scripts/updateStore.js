export default store => {
  return `;(() => {
    window.SignalStore.store = formatInput(JSON.parse(atob('${store}')))

    if(window.SignalStore.store !== {}) {
      Object.keys(window.SignalStore.store).map((item) => {
        if (/^(session)/.test(item)) {
          window.SignalStore.store[item] = JSON.parse(window.SignalStore.store[item])
        }
      })
    }

  })();`
}
