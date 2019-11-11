import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { database } from '../app/database/database'
import { DatabaseContext } from '../app/database/DatabaseContext'
import { Icon } from 'react-native-elements'
import Message from '../components/Message'
import { TouchableHighlight } from 'react-native-gesture-handler'
import useSignal from '../app/signal/useSignal'
import * as AppStorage from '../app/AppStorage'

export default Conversation = props => {
  const [databaseState, setDatabaseState] = useContext(DatabaseContext)
  const [participants, setParticipants] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const { sendMessage } = useSignal()

  const getParticipants = async () => {
    const user = await AppStorage.getUser()
    const participants = [
      {
        id: 0,
        name: user.username,
        me: true,
      },
    ]
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

            participants.push({
              id: user.id,
              identifer: user.identifer,
              identityKey: user.identityKey,
              image: user.image,
              name: user.name,
              registrationId: user.registrationId,
              me: false,
            })
          },
        )
      }
    })

    setParticipants(participants)
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

    console.log(participants[1])

    const cipherText = await sendMessage(newMessage, participants[1].registationId)

    console.log(cipherText)

    /*database.transaction(tx => {
      tx.executeSql(
        'INSERT INTO messages (content, type, date, contactId, conversationId) VALUES (?, ?, ?, ?, ?)',
        [newMessage, 'text', new Date(), 0, props.navigation.getParam('id', null)],
        () => {
          setDatabaseState(prevState => prevState + 1)
        },
      )
    })

    setNewMessage('')*/
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
      </View>
      <ScrollView style={styles.messageContainer}>
        {messages.map((item, i) => {
          return (
            <Message
              key={i}
              user={participants.find(p => {
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
