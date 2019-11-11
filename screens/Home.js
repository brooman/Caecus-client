import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { database } from '../app/database/database'
import { Card, ListItem, Icon, Badge } from 'react-native-elements'
import TouchableScale from 'react-native-touchable-scale'
import { DatabaseContext } from '../app/database/DatabaseContext'
import * as AppStorage from '../app/AppStorage'

export default Home = props => {
  const [isInstalled, setIsInstalled] = useState(true)
  const [databaseState, setDatabaseState] = useContext(DatabaseContext)
  const [conversations, setConversations] = useState([])

  useEffect(() => {
    database.transaction(
      tx => {
        tx.executeSql(
          `
          SELECT
            conversations.id as id,
            contacts.name,
            contacts.image
          FROM conversations
          INNER JOIN contacts ON conversations.contactId = contacts.id
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

  useEffect(() => {
    AppStorage.getUser().then(res => setIsInstalled(res))

    if (!isInstalled) {
      props.navigation.navigate('Installation')
    }
  })

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <Card containerStyle={styles.card}>
          <>
            {conversations.map((item, i) => {
              return (
                <ListItem
                  key={i}
                  Component={TouchableScale}
                  friction={90}
                  tension={100}
                  activeScale={0.95}
                  title={item.name}
                  subtitle={'last message'}
                  leftAvatar={{
                    source: item.image && { uri: item.image },
                    title: item.name[0],
                  }}
                  rightElement={() => <Badge value="99+" status="error" />}
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
      <TouchableScale
        style={styles.addButton}
        friction={90}
        tension={100}
        activeScale={0.9}
        title="Start new conversation"
        onPress={() => {
          props.navigation.navigate('NewConversation')
        }}
      >
        <Icon raised reverse name="plus" type="feather" size={26} />
      </TouchableScale>
    </View>
  )
}

Home.navigationOptions = {
  title: 'Caecus',
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
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
})
