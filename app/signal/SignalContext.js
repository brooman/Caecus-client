import React, { useRef, useState, forwardRef, useCallback, useEffect } from 'react'
import Config from '../config'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'
import useSignal from './useSignal'

const SignalContext = React.createContext([{}, () => {}])

const SignalContextProvider = props => {
  const { handle } = useSignal()
  const _ref = useRef(null)

  let running = false
  const promises = {}
  const callstack = []

  const run = async (code, id) => {
    const promise = new Promise(resolve => {
      promises[id] = resolve
    })

    callstack.push(code)

    if (!running) runner(callstack.shift())

    return promise
  }

  const runner = code => {
    running = true
    _ref.current.injectJavaScript(code)

    if (callstack.length < 1) {
      running = false
    }
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
            const data = JSON.parse(event.nativeEvent.data)
            handle(data)
            promises[data.id](data.value)
            delete promises[data.id]
            runner(callstack.shift())
          }}
        />
      </View>
      {props.children}
    </SignalContext.Provider>
  )
}

export { SignalContext, SignalContextProvider }
