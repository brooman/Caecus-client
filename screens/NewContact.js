import React, { useState, useContext } from 'react'
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import { database } from '../app/database/database'
import { DatabaseContext } from '../app/database/DatabaseContext'
import Config from '../app/config/'

const NewContact = props => {
  const [databaseState, setDatabaseState] = useContext(DatabaseContext)
  const [name, setName] = useState('')
  const [identifier, setIdentifier] = useState('')
  const { startSession } = useSignal()

  const handleSubmit = () => {
    if (name.length < 3) return

    fetch(`${Config.host.http}/connect`, {
      method: 'POST',
      body: JSON.parse({
        username: name,
        identifier: identifier,
      }),
    })
      .then(res => JSON.parse(res.json()))
      .then(res => {
        const { username, identifier, deviceId } = res.user
        const { identity, registrationId, signedPreKey, preKey } = res.preKeyBundle
        database.transaction(
          tx => {
            tx.executeSql(
              `INSERT INTO contacts (name, identifer, identityKey, deviceId, registrationId) VALUES (?, ?, ?, ?)`,
              [username, identifier, identity, deviceId, registrationId],
              null,
            )
          },
          e => console.log(e),
        )
        setName('')
        setDatabaseState(prevState => prevState + 1)
        props.navigation.navigate('NewConversation')
      })
  }

  NewContact.navigationOptions = {
    title: 'Find Contact',
  }

  return (
    <View styles={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="name"
          value={name}
          onChangeText={text => {
            setName(text)
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="identifier"
          value={identifier}
          onChangeText={text => {
            setName('#' + text)
          }}
        />
        <TouchableOpacity onPress={handleSubmit}>
          <Icon reverse name="plus" type="feather" style={styles.send} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default NewContact

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    padding: 0,
    margin: 0,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxHeight: 80,
    backgroundColor: '#444',
    paddingVertical: 30,
    paddingHorizontal: 5,
  },
  input: {
    width: '80%',
    backgroundColor: '#fff',
    height: 50,
    paddingHorizontal: 15,
    paddingVertical: 5,
    fontSize: 16,
    borderRadius: 32,
    marginLeft: 15,
  },
  send: {
    width: 32,
  },
})
