import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { database } from '../app/database/useDatabase'
import { Card, ListItem, Icon } from 'react-native-elements'
import TouchableScale from 'react-native-touchable-scale'
import { useDatabase } from '../app/database/useDatabase'
import NewContact from '../components/NewContact'

const NewConversation = (props) => {
  const { getContacts, findOrCreateConversation } = useDatabase()
  const [contacts, setContacts] = useState([])
  const [newContactVisible, setNewContactVisible] = useState(false)

  useEffect(() => {
    getContacts().then((res) => setContacts(res))
  }, [])

  const startConversation = (contactId) => {
    findOrCreateConversation(contactId).then(() => {})
    props.navigation.navigate('Home')
  }

  return (
    <>
      <ScrollView styles={styles.container}>
        <NewContact
          isVisible={newContactVisible}
          setIsVisible={setNewContactVisible}
          navigate={props.navigation.navigate}
        />
        <>
          {contacts.map((item, i) => {
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
          setNewContactVisible(!newContactVisible)
        }}>
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
