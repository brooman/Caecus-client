import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

const Message = props => {
  const { sender, content, timestamp } = props
  const styles = createStyleSheet(sender.user)
  return (
    <View style={styles.row}>
      <View style={styles.bubble}>
        <Text style={styles.text}>{content}</Text>
      </View>
    </View>
  )
}

const createStyleSheet = isUser => {
  return StyleSheet.create({
    row: {
      flex: 1,
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      width: '100%',
      paddingHorizontal: 10,
      marginBottom: 5,
    },
    bubble: {
      backgroundColor: isUser ? '#ddd' : '#099',
      borderRadius: 16,
      paddingVertical: 10,
      paddingHorizontal: 15,
      marginLeft: isUser ? 'auto' : 10,
      marginRight: isUser ? 10 : 'auto',
    },
    text: {
      color: isUser ? '#000' : '#fff',
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '400',
    },
  })
}

export default Message
