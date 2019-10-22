import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { database } from '../app/database'
import { DatabaseContext } from '../app/DatabaseContext'
import { Icon } from 'react-native-elements'
import Message from '../components/Message'
import { TouchableHighlight } from 'react-native-gesture-handler'

export default Conversation = props => {
  const [databaseState, setDatabaseState] = useContext(DatabaseContext)
  const [participants, setParticipants] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  const getMessages = () => {
    database.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM messages WHERE conversation_id = ?',
        [props.navigation.getParam('id', null)],
        (_, { rows: { _array } }) => {
          setMessages(_array)
        },
      )
    })
  }

  useEffect(() => {
    setParticipants([
      {
        id: 0,
        name: 'Me',
        image: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        user: true,
      },
      {
        id: 1,
        name: 'SomeoneElse',
        image: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        user: false,
      },
    ])

    getMessages()
  }, [databaseState])

  const handleSend = () => {
    if (newMessage.length === 0) return

    database.transaction(tx => {
      tx.executeSql(
        'INSERT INTO messages (content, type, date, sender_id, conversation_id) VALUES (?, ?, ?, ?, ?)',
        [newMessage, 'text', new Date(), 0, props.navigation.getParam('id', null)],
        () => {
          setDatabaseState(prevState => prevState + 1)
        },
      )
    })

    setNewMessage('')
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
              sender={participants.find(p => {
                return p.id === item.sender_id
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
