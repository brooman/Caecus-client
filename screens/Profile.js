import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default Profile = () => {
  return (
    <View style={styles.container}>
      <Text>Hello from profile</Text>
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
})
