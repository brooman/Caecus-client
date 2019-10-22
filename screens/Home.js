import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { database } from '../app/database'
import { Card, ListItem } from 'react-native-elements'
import TouchableScale from 'react-native-touchable-scale'
import { DatabaseContext } from '../app/DatabaseContext'

export default Home = props => {
  const [databaseState, setDatabaseState] = useContext(DatabaseContext)
  const [conversations, setConversations] = useState([])

  useEffect(() => {
    database.transaction(
      tx => {
        tx.executeSql(
          `
          SELECT
            conversations.id as id,
            senders.name,
            senders.image
          FROM conversations
          INNER JOIN senders ON conversations.sender_id = senders.id
          `,
          null,
          (_, { rows: { _array } }) => setConversations(_array),
        )
      },
      e => {
        console.warn(e)
      },
    )
  }, [databaseState])

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <Card containerStyle={styles.card}>
          <ListItem
            Component={TouchableScale}
            friction={90}
            tension={100}
            activeScale={0.95}
            title="Start new conversation"
            onPress={() => {
              props.navigation.navigate('NewConversation')
            }}
            bottomDivider
            chevron
          />

          <>
            {conversations.map((item, i) => {
              console.log(item)
              return (
                <ListItem
                  key={i}
                  Component={TouchableScale}
                  friction={90}
                  tension={100}
                  activeScale={0.95}
                  title={item.name}
                  //subtitle={item.lastMessage}
                  leftAvatar={{
                    source: item.image && { uri: item.image },
                    title: item.name[0],
                  }}
                  onPress={() => {
                    props.navigation.navigate('Conversation', {
                      id: item.id,
                    })
                  }}
                  bottomDivider
                  chevron
                />
              )
            })}
          </>
        </Card>
      </ScrollView>
    </View>
  )
}

Home.navigationOptions = {
  title: 'Home',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    padding: 0,
    margin: 0,
  },
})
