import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { database } from '../app/database/useDatabase'
import { DatabaseContext } from '../app/database/DatabaseContext'
import { Icon } from 'react-native-elements'
import Message from '../components/Message'
import { TouchableHighlight } from 'react-native-gesture-handler'
import useSignal from '../app/signal/useSignal'
import * as AppStorage from '../app/AppStorage'
import Config from '../app/config'

export default Conversation = props => {
  const [databaseState, setDatabaseState] = useContext(DatabaseContext)
  const [participants, setParticipants] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const { encryptMessage } = useSignal()

  const getParticipants = () => {
    const p = []

    AppStorage.getUser()
      .then(user => JSON.parse(user))
      .then(user => {
        p.push({
          id: 0,
          name: user.username,
          identifier: user.identifier,
          me: true,
        })
      })

    let contactId = null

    database.transaction(tx => {
      tx.executeSql(
        'SELECT contactId FROM conversations WHERE id = ?',
        [props.navigation.getParam('id', null)],
        (_, { rows: { _array } }) => {
          contactId = _array[0]['contactId']
        },
      )
    })

    database.transaction(tx => {
      if (contactId) {
        tx.executeSql(
          'SELECT * FROM contacts WHERE id = ?',
          [contactId],
          (_, { rows: { _array } }) => {
            const user = _array[0]

            p.push({
              id: user.id,
              identifier: user.identifier,
              identityKey: user.identityKey,
              image: user.image,
              name: user.name,
              registrationId: user.registrationId,
              me: false,
            })

            setParticipants(p)
          },
        )
      }
    })
  }

  const getMessages = () => {
    database.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM messages WHERE conversationId = ?',
        [props.navigation.getParam('id', null)],
        (_, { rows: { _array } }) => {
          setMessages(_array)
        },
      )
    })
  }

  useEffect(() => {
    getParticipants()
    getMessages()
  }, [databaseState])

  const handleSend = async () => {
    if (newMessage.length === 0) return

    const cipherText = await encryptMessage(newMessage, participants[1].registrationId)

    const data = {
      fromUsername: participants[0].name,
      fromIdentifier: participants[0].identifier,
      toUsername: participants[1].name,
      toIdentifier: participants[1].identifier,
      message: cipherText,
    }

    fetch(`${Config.host.http}/messages/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(json => {
        console.log(json)
      })

    database.transaction(tx => {
      tx.executeSql(
        'INSERT INTO messages (content, type, date, contactId, conversationId) VALUES (?, ?, ?, ?, ?)',
        [newMessage, 'text', new Date().toString(), 0, props.navigation.getParam('id', null)],
        () => {
          setDatabaseState(prevState => prevState + 1)
        },
      )
    })

    setNewMessage('')
  }

  const fetchFromServer = () => {
    const data = {
      username: participants[0].name,
      identifier: participants[0].identifier,
    }

    fetch(`${Config.host.http}/messages/recieve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(json => {
        console.log(json)
      })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>
          {participants
            .map(p => {
              return p.name
            })
            .join(', ')}
        </Text>
        <TouchableOpacity onPress={handleSend}>
          <Icon
            reverse
            name="refresh-cw"
            type="feather"
            style={styles.send}
            onPress={() => {
              fetchFromServer()
            }}
          />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.messageContainer}>
        {messages.map((item, i) => {
          return (
            <Message
              key={i}
              contact={participants.find(p => {
                return p.id === item.contactId
              })}
              content={item.content}
              timestamp={item.timestamp}
            />
          )
        })}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write message"
          value={newMessage}
          onChangeText={text => {
            setNewMessage(text)
          }}
        />
        <TouchableOpacity onPress={handleSend}>
          <Icon reverse name="send" type="feather" style={styles.send} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

Conversation.navigationOptions = {
  title: 'Conversation',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    height: 75,
  },
  messageContainer: {
    height: 'auto',
    width: '100%',
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
    flexGrow: 80,
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
