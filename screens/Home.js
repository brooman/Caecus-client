import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { useDatabase } from '../app/database/useDatabase'
import { Card, ListItem, Icon, Badge } from 'react-native-elements'
import TouchableScale from 'react-native-touchable-scale'
import * as AppStorage from '../app/AppStorage'

export default Home = (props) => {
  const [isInstalled, setIsInstalled] = useState(true)
  const [conversations, setConversations] = useState([])
  const { getConversations } = useDatabase()

  useEffect(() => {
    AppStorage.getUser().then((res) => {
      setIsInstalled(res)
    })

    if (!isInstalled) {
      props.navigation.navigate('Installation')
    }

    getConversations().then((res) => setConversations(res))
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
        }}>
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
