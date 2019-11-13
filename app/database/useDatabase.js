import React, { useContext } from 'react'
import * as SQLite from 'expo-sqlite'
import { DatabaseContext } from './DatabaseContext'

const database = SQLite.openDatabase('storage.db')

const createDatabase = () => {
  database.transaction(
    (tx) => {
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS messages (
          id	INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT,
          content	TEXT,
          date TEXT,
          contactId	INTEGER,
          conversationId	INTEGER
        );
      `)
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS conversations (
          id	INTEGER PRIMARY KEY AUTOINCREMENT,
          name	TEXT NOT NULL,
          contactId INTEGER NOT NULL UNIQUE
        );
      `)
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS contacts (
          id	INTEGER PRIMARY KEY AUTOINCREMENT,
          name	TEXT NOT NULL,
          identifer TEXT NOT NULL,
          identityKey TEXT NOT NULL,
          deviceId INT NOT NULL,
          registrationId NOT NULL,
          image	BLOB
        );
      `)
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS preKeys (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          keyId INTEGER NOT NULL,
          publicKey TEXT NOT NULL,
          privateKey TEXT NOT NULL
        )
      `)
    },
    (e) => {
      console.warn(e)
    },
  )
}

const useDatabase = () => {
  const { updateDatabaseState } = useContext(DatabaseContext)

  const getContacts = () => {
    return new Promise((resolve) => {
      database.transaction((tx) => {
        tx.executeSql(`SELECT * FROM contacts`, null, (_, { rows: { _array } }) => {
          resolve(_array)
        })
      })
    })
  }

  const getContactFromConversationId = (conversationId) => {
    return new Promise((resolve) => {
      let contactId

      database.transaction((tx) => {
        tx.executeSql(
          'SELECT contactId FROM conversations WHERE id = ?',
          [conversationId],
          (_, { rows: { _array } }) => {
            contactId = _array[0]['contactId']
          },
        )
      })

      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM contacts WHERE id = ?',
          [contactId],
          (_, { rows: { _array } }) => {
            const user = _array[0]

            resolve({
              id: user.id,
              identifier: user.identifier,
              identityKey: user.identityKey,
              image: user.image,
              name: user.name,
              registrationId: user.registrationId,
              me: false,
            })
          },
        )
      })
    })
  }

  const createContact = (contact) => {
    const { username, identifier, identity, deviceId, registrationId } = contact.user

    return new Promise((resolve) => {
      database.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO contacts (name, identifier, identityKey, deviceId, registrationId) VALUES (?, ?, ?, ?, ?)`,
          [username, identifier, identity, deviceId, registrationId],
          (tx, results) => {
            updateDatabaseState()
            resolve(results.insertId)
          },
          (tx, e) => {
            console.error(e)
          },
        )
      })
    })
  }

  const findContact = (username, identifier) => {
    return new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM contacts WHERE username = ? AND identifier = ?`,
          [username, identifier],
          (_, { rows: { _array } }) => {
            if (_array[0]) {
              resolve(_array[0])
            } else {
              resolve(null)
            }
          },
        )
      })
    })
  }

  const getConversations = () => {
    return new Promise((resolve) => {
      database.transaction((tx) => {
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
          (_, { rows: { _array } }) => {
            resolve(_array)
          },
        )
      })
    })
  }

  const findOrCreateConversation = (contactId) => {
    return new Promise((resolve) => {
      database.transaction((tx) => {
        tx.executeSql(
          `SELECT id FROM conversations WHERE contactId = ?`,
          [contactId],
          (_, { rows: { _array } }) => {
            if (_array.length > 0) {
              resolve(_array[0].id)
            }
          },
        )

        tx.executeSql(
          `INSERT INTO conversations (name, contactId) VALUES ((SELECT name FROM contacts WHERE id = ?), ?)`,
          [contactId, contactId],
          (tx, results) => {
            updateDatabaseState()
            resolve(results.insertId)
          },
        )
      })
    })
  }

  const getMessages = (conversationId) => {
    return new Promise((resolve) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM messages WHERE conversationId = ?',
          [conversationId],
          (_, { rows: { _array } }) => {
            resolve(_array)
          },
        )
      })
    })
  }

  const createMessage = (body) => {
    const { message, type, date, contactId, conversationId } = body

    return new Promise((resolve) => {
      database.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO messages (content, type, date, contactId, conversationId) VALUES (?, ?, ?, ?, ?)',
          [message, type, date, contactId, conversationId],
          () => {
            updateDatabaseState()
            resolve(true)
          },
        )
      })
    })
  }

  const storePreKey = (preKey) => {
    const { keyId, pubKey, privKey } = preKey

    return new Promise((resolve) => {
      database.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO preKeys (keyId, publicKey, privateKey) VALUES (?, ?, ?)`,
          [keyId, pubKey, privKey],
          () => {
            resolve(true)
          },
        )
      })
    })
  }

  return {
    getContacts,
    getContactFromConversationId,
    createContact,
    findContact,
    getConversations,
    findOrCreateConversation,
    getMessages,
    createMessage,
    storePreKey,
  }
}

export { database, createDatabase, useDatabase }
