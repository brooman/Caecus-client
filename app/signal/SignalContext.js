import React, { useRef, useState, forwardRef, useCallback, useEffect } from 'react'
import Config from '../config'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

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

  return (
    <SignalContext.Provider value={{ run: run }}>
      <View hide>
        <WebView
          ref={_ref}
          source={{
            html: `<html><body><h1>Test</h1><script src="https://cdn.conversejs.org/3rdparty/libsignal-protocol.min.js"></script><script>function ab2str(r){return btoa(String.fromCharCode(...new Uint8Array(r)));}function str2ab(r){return Uint8Array.from([...atob(r)].map(ch => ch.charCodeAt())).buffer}</script></body></html>`,
          }}
          onMessage={event => {
            resolver(event.nativeEvent.data)
          }}
        />
      </View>
      {props.children}
    </SignalContext.Provider>
  )
}

export { SignalContext, SignalContextProvider }
