import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import Message from '../components/Message'
import { TouchableHighlight } from 'react-native-gesture-handler'

export default Conversation = () => {
  const [participants, setParticipants] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

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

    setMessages([
      {
        id: 0,
        sender: 1,
        content: 'Hi',
        timestamp: '1571319880',
      },
      {
        id: 1,
        sender: 0,
        content: 'Hello',
        timestamp: '1571319990',
      },
    ])
  }, [])

  const handleSend = () => {
    setMessages([
      ...messages,
      {
        id: null,
        sender: 0,
        content: newMessage,
        timestamp: Date.now(),
      },
    ])

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
                return p.id === item.sender
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
