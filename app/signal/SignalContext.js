import React, { useRef, useState, forwardRef, useCallback, useEffect } from 'react'
import Config from '../config'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'
import * as SignalStore from './SignalStore'
import Scripts from './scripts'

const SignalContext = React.createContext([{}, () => {}])

const SignalContextProvider = props => {
  const _ref = useRef(null)

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
          onMessage={e => {
            event = JSON.parse(e.nativeEvent.data)
            SignalStore.saveInMemoryStore(event.store)
            console.log(event.msg)
            resolver(event.msg)
          }}
          onLoad={() => {
            SignalStore.getInMemoryStore().then(res => {
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
