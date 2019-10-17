import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, TextInput } from 'react-native'

export default Conversation = () => {
  const [messages, setMessages] = useState([])

  useEffect(() => {}, [])

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messageContainer}></ScrollView>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Write message" />
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
  messageContainer: {
    height: '95%',
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#eee',
    paddingVertical: 30,
    paddingHorizontal: 5,
  },
  input: {
    backgroundColor: '#fff',
    height: 50,
    paddingHorizontal: 15,
    paddingVertical: 5,
    fontSize: 16,
    borderRadius: 32,
    marginLeft: 15,
    marginRight: 15,
  },
})
