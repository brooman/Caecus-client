import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { database } from '../app/database'
import { Card, ListItem, Icon } from 'react-native-elements'
import TouchableScale from 'react-native-touchable-scale'
import { DatabaseContext } from '../app/DatabaseContext'

const NewConversation = props => {
  const [databaseState, setDatabaseState] = useContext(DatabaseContext)
  const [senders, setSenders] = useState([])

  useEffect(() => {
    database.transaction(tx => {
      tx.executeSql(`SELECT * FROM senders`, null, (_, { rows: { _array } }) => setSenders(_array))
    })
  }, [databaseState])

  startConversation = id => {
    let conversationId = null

    database.transaction(tx => {
      tx.executeSql(
        `SELECT id FROM conversations WHERE sender_id = ?`,
        [id],
        (_, { rows: { _array } }) => {
          if (_array.length > 0) {
            conversationId = _array[0].id
          }
        },
      )

      if (conversationId === null) {
        tx.executeSql(
          `INSERT INTO conversations (name, sender_id) VALUES ((SELECT name FROM senders WHERE id = ?), ?)`,
          [id, id],
          (tx, results) => {
            conversationId = results.insertId
            setDatabaseState(prevState => prevState + 1)
          },
        )
      }
    })

    props.navigation.navigate('Home')
  }

  return (
    <>
      <ScrollView styles={styles.container}>
        <>
          {senders.map((item, i) => {
            return (
              <ListItem
                key={i}
                Component={TouchableScale}
                friction={90}
                tension={100}
                activeScale={0.95}
                title={item.name}
                //subtitle={item.subtitle}
                leftAvatar={{
                  source: item.image && { uri: item.image },
                  title: item.name[0],
                }}
                onPress={() => {
                  startConversation(item.id)
                }}
                bottomDivider
                chevron
              />
            )
          })}
        </>
      </ScrollView>
      <TouchableScale
        style={styles.addButton}
        friction={90}
        tension={100}
        activeScale={0.9}
        title="Start new conversation"
        onPress={() => {
          props.navigation.navigate('AddSender')
        }}
      >
        <Icon raised reverse name="plus" type="feather" size={26} />
      </TouchableScale>
    </>
  )
}

NewConversation.navigationOptions = {
  title: 'Contacts',
}

export default NewConversation

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