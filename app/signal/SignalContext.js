import React, { useRef } from 'react'
import Config from '../config'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'
import useSignalStore from './useSignalStore'
import Scripts from './scripts'

const SignalContext = React.createContext([{}, () => {}])

const SignalContextProvider = (props) => {
  const _ref = useRef(null)
  const { saveInMemoryStore, getInMemoryStore } = useSignalStore()

  let resolver

  const run = async (code) => {
    const promise = new Promise((resolve) => {
      resolver = resolve
    })

    _ref.current.injectJavaScript(code)

    return await promise
  }

  const html = `
    <html>
      <body>
        <script src="${Config.host.http}/libsignal.js"></script>
        <script src="${Config.host.http}/setup.js"></script>
      </body>
    </html>
  `

  return (
    <SignalContext.Provider value={{ run: run }}>
      <View hide>
        <WebView
          ref={_ref}
          source={{
            html: html,
          }}
          onMessage={(e) => {
            event = JSON.parse(e.nativeEvent.data)
            saveInMemoryStore(event.store)
            resolver(event.msg)
          }}
          onLoad={() => {
            getInMemoryStore().then((res) => {
              return _ref.current.injectJavaScript(Scripts.updateStore(res))
            })
          }}
        />
      </View>
      {props.children}
    </SignalContext.Provider>
  )
}

export { SignalContext, SignalContextProvider }
