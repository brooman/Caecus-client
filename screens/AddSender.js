import React, { useState, useContext } from 'react'
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import { database } from '../app/database/database'
import { DatabaseContext } from '../app/database/DatabaseContext'

const AddSender = props => {
  const [databaseState, setDatabaseState] = useContext(DatabaseContext)
  const [name, setName] = useState('')

  const handleSubmit = () => {
    if (name.length < 1) return

    database.transaction(
      tx => {
        tx.executeSql(`INSERT INTO senders (name) VALUES (?)`, [name], null)
      },
      e => console.log(e),
    )
    setName('')
    setDatabaseState(prevState => prevState + 1)
    props.navigation.navigate('NewConversation')
  }

  AddSender.navigationOptions = {
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
        <TouchableOpacity onPress={handleSubmit}>
          <Icon reverse name="plus" type="feather" style={styles.send} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AddSender

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
    flexDirection: 'row',
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
