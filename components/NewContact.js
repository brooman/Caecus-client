import React, { useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { Overlay } from 'react-native-elements'
import { Icon, Button, Input } from 'react-native-elements'
import { getContact, getPreKeyBundle } from '../app/network'
import { useDatabase } from '../app/database/useDatabase'
import * as AppStorage from '../app/AppStorage'

const NewContact = (props) => {
  const [input, setInput] = useState('')
  const [validUsername, setValidUsername] = useState(false)
  const [name, setName] = useState('')
  const [identifier, setIdentifier] = useState('')
  const { createContact } = useDatabase()
  const { startSession } = useSignal()

  const handleSubmit = async () => {
    const body = {
      username: name,
      identifier: identifier,
    }

    const contact = await getContact(body)
    const preKeyBundle = await getPreKeyBundle(body)

    await createContact(contact)
    await startSession(Object.assign(contact, preKeyBundle))

    props.setIsVisible(false)
  }

  return (
    <Overlay
      isVisible={props.isVisible}
      height={250}
      onBackdropPress={() => {
        props.setIsVisible(false)
      }}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Input
            style={styles.input}
            label="Enter username"
            placeholder="Username#1234"
            value={input}
            autoCorrect={false}
            onChangeText={(text) => {
              setInput(text)

              const regex = /^[A-Za-z]{3,16}#[0-9]{4}$/

              if (regex.test(text)) {
                const values = text.split('#')
                setName(values[0])
                setIdentifier('#' + values[1])
                setValidUsername(true)
              } else {
                setValidUsername(false)
              }
            }}
          />
        </View>
        <Button
          disabled={!validUsername}
          title="Add Contact"
          buttonStyle={styles.button}
          onPress={handleSubmit}
        />
      </View>
    </Overlay>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 25,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: '#fff',
    height: 50,
    fontSize: 16,
  },
  buttonContainer: {
    width: '80%',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#212121',
  },
})

export default NewContact
