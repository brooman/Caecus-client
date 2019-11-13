import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { useDatabase } from '../app/database/useDatabase'
import { Icon } from 'react-native-elements'
import Message from '../components/Message'
import { TouchableHighlight } from 'react-native-gesture-handler'
import useSignal from '../app/signal/useSignal'
import * as AppStorage from '../app/AppStorage'
import Config from '../app/config'
import { sendMessage, recieveMessages } from '../app/network'

export default Conversation = (props) => {
  const [participants, setParticipants] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const { encryptMessage, decryptMessage } = useSignal()
  const { getContactFromConversationId, getMessages } = useDatabase()

  const getParticipants = () => {
    const p = []

    AppStorage.getUser()
      .then((user) => JSON.parse(user))
      .then((user) => {
        p.push({
          id: 0,
          name: user.username,
          identifier: user.identifier,
          me: true,
        })
      })

    getContactFromConversationId(props.navigation.getParam('id')).then((contact) => {
      p.push(contact)
    })

    setParticipants(p)
  }

  useEffect(() => {
    getParticipants()
    getMessages().then((messages) => {
      setMessages(messages)
    })
  }, [])

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

    sendMessage(data).then(() => {
      const message = {
        message: newMessage,
        type: 'text',
        date: new Date().toString(),
        contactId: 0,
        conversationId: props.navigation.getParam('id'),
      }

      createMessage(message)
    })

    setNewMessage('')
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>
          {participants
            .map((p) => {
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
              contact={participants.find((p) => {
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
          onChangeText={(text) => {
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
