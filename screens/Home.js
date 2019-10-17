import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { Card, ListItem } from 'react-native-elements'
import TouchableScale from 'react-native-touchable-scale'

export default Home = props => {
  const [conversations, setConversations] = useState([])

  useEffect(() => {
    setConversations([
      {
        name: 'Amy Farha',
        subtitle: 'Vice President',
      },
      {
        name: 'Chris Jackson',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'Vice Chairman',
      },
      {
        name: 'Amy Farha',
        subtitle: 'Vice President',
      },
      {
        name: 'Chris Jackson',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'Vice Chairman',
      },
      {
        name: 'Amy Farha',
        subtitle: 'Vice President',
      },
      {
        name: 'Chris Jackson',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'Vice Chairman',
      },
      {
        name: 'Amy Farha',
        subtitle: 'Vice President',
      },
      {
        name: 'Chris Jackson',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'Vice Chairman',
      },
      {
        name: 'Amy Farha',
        subtitle: 'Vice President',
      },
      {
        name: 'Chris Jackson',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'Vice Chairman',
      },
      {
        name: 'Amy Farha',
        subtitle: 'Vice President',
      },
      {
        name: 'Chris Jackson',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'Vice Chairman',
      },
      {
        name: 'Amy Farha',
        subtitle: 'Vice President',
      },
      {
        name: 'Chris Jackson',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'Vice Chairman',
      },
    ])
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <Card containerStyle={styles.card}>
          {conversations.map((item, i) => {
            return (
              <ListItem
                key={i}
                Component={TouchableScale}
                friction={90}
                tension={100}
                activeScale={0.95}
                title={item.name}
                subtitle={item.subtitle}
                leftAvatar={{
                  source: item.avatar_url && { uri: item.avatar_url },
                  title: item.name[0],
                }}
                onPress={() => {
                  props.navigation.navigate('Conversation')
                }}
                bottomDivider
                chevron
              />
            )
          })}
        </Card>
      </ScrollView>
    </View>
  )
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
