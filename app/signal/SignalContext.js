import React, { useRef, useState, forwardRef, useCallback, useEffect } from 'react'
import Config from '../config'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'
import * as SignalStore from './SignalStore'
import Scripts from './scripts'

const SignalContext = React.createContext([{}, () => {}])

const SignalContextProvider = props => {
  const _ref = useRef(null)

  useEffect(() => {
    SignalStore.getInMemoryStore().then(res => run(Scripts.updateStore(res)))
  }, [])

  let resolver

  const run = async code => {
    const promise = new Promise(resolve => {
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
          onMessage={event => {
            console.log(JSON.parse(event.nativeEvent.data).store)
            SignalStore.saveInMemoryStore(JSON.parse(event.nativeEvent.data).store)
            resolver(JSON.parse(event.nativeEvent.data).msg)
          }}
        />
      </View>
      {props.children}
    </SignalContext.Provider>
  )
}

export { SignalContext, SignalContextProvider }
