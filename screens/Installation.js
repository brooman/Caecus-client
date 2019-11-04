import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Input, Button } from 'react-native-elements'
import * as SignalStore from '../app/signal/SignalStore'
import useSignal from '../app/signal/useSignal'
import * as AppStorage from '../app/AppStorage'

const Installation = props => {
  const [state, setState] = useState(0)
  const [username, setUsername] = useState('')
  const [user, setUser] = useState({ username: null, identifier: null })
  const [loading, setLoading] = useState(false)
  const { createRegistrationId, createIdentity, createSignedPreKey, createPreKeys } = useSignal()

  const register = async () => {
    setLoading(true)

    const registrationId = JSON.parse(await createRegistrationId()).value
    const identity = await createIdentity()
    const signedPreKey = await createSignedPreKey(identity, 5)
    const preKeys = await createPreKeys(registrationId + 1, 5)

    SignalStore.storeIdentityKeyPair(JSON.parse(identity).value)
    SignalStore.storeRegistrationId(registrationId)

    const signedPreKeyPublic = key => {
      let k = JSON.parse(key)

      return {
        keyId: k.value.keyId,
        key: k.value.keyPair.pubKey,
        signature: k.value.signature,
      }
    }

    const preKeysPublic = keys => {
      let k = JSON.parse(keys)

      return k.map(key => {
        return {
          keyId: key.value.keyId,
          key: key.value.keyPair.pubKey,
        }
      })
    }

    const data = {
      username: username,
      password: 'secret',
      deviceId: 1,
      registrationId: registrationId,
      identityKey: JSON.parse(identity).value.pubKey,
      signedPreKey: signedPreKeyPublic(signedPreKey),
      preKeys: preKeysPublic(preKeys),
    }

    fetch('http://127.0.0.1:3333/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(json => {
        finishRegister(json)
      })
  }

  const finishRegister = json => {
    AppStorage.storeUser(json.user)
    AppStorage.storeAccessToken(json.access_token)
    setLoading(false)
    setUser(json.user)
    setState(state + 1)
  }

  switch (state) {
    case 0:
      return (
        <View style={styles.container}>
          <Text style={styles.text}>Welcome to Caecus</Text>
          <Input
            disabled={loading}
            style={styles.input}
            placeholder="Enter your desired username"
            value={username}
            onChangeText={text => {
              setUsername(text)
            }}
          />
          <Button
            buttonStyle={styles.button}
            title="Sign up"
            onPress={() => {
              if (username.length > 3) {
                register()
              }
            }}
            disabled={username.length < 4}
            loading={loading}
          />
        </View>
      )
    case 1:
      return (
        <View style={styles.container}>
          <Text style={styles.text}>Success!</Text>
          <Text style={styles.username}>
            {user.username}
            <Text style={styles.useridentifier}>{user.identifier}</Text>
          </Text>
          <Button
            buttonStyle={styles.button}
            title="Finish"
            onPress={() => {
              setState(state + 1)
            }}
          />
        </View>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 100,
    paddingTop: '25%',
    paddingBottom: '25%',
    paddingRight: 50,
    paddingLeft: 50,
  },
  text: {
    fontSize: 48,
    textAlign: 'center',
  },
  button: {
    height: 60,
    borderRadius: 16,
    backgroundColor: '#333',
    width: '100%',
  },
  user: {
    flex: 1,
  },
  username: {
    fontSize: 32,
  },
  useridentifier: {
    fontSize: 24,
    color: '#666',
  },
})

export default Installation
