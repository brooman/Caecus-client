import React, { useRef, useState, forwardRef, useCallback, useEffect } from 'react'
import Config from '../config'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'
import useSignal from './useSignal'

const SignalContext = React.createContext([{}, () => {}])

const SignalContextProvider = props => {
  const { handle } = useSignal()
  const _ref = useRef(null)

  const promises = {}

  const run = async (code, id) => {
    const promise = new Promise(resolve => {
      promises[id] = resolve
    })

    _ref.current.injectJavaScript(code)

    return promise
  }

  return (
    <SignalContext.Provider value={{ run: run }}>
      {console.log('render')}
      <View hide>
        <WebView
          ref={_ref}
          source={{
            html: `<html><body><h1>Test</h1><script src="https://cdn.conversejs.org/3rdparty/libsignal-protocol.min.js"></script><script>function ab2str(r){return btoa(String.fromCharCode(...new Uint8Array(r)));}function str2ab(r){return Uint8Array.from([...atob(r)].map(ch => ch.charCodeAt())).buffer}</script></body></html>`,
          }}
          onMessage={event => {
            const data = JSON.parse(event.nativeEvent.data)
            handle(data)
            promises[data.id](data.value)
            delete promises[data.id]
          }}
        />
      </View>
      {props.children}
    </SignalContext.Provider>
  )
}

export { SignalContext, SignalContextProvider }
