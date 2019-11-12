import React, { useContext } from 'react'
import * as SQLite from 'expo-sqlite'
import { DatabaseContext } from './DatabaseContext'

export default useDatabase = () => {
  const { updateDatabaseState } = useContext(DatabaseContext)

  const database = SQLite.openDatabase('storage.db')

  const createDatabase = () => {
    return new Promise(resolve => {
      database.transaction(tx => {
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
          identifier TEXT NOT NULL,
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
      })
      resolve(true)
    })
  }

  const getContacts = () => {
    return new Promise(resolve => {
      database.transaction(tx => {
        tx.executeSql(`SELECT * FROM contacts`, null, (_, { rows: { _array } }) => {
          resolve(_array)
        })
      })
    })
  }

  const createContact = (username, identifier, identity, deviceId, registrationId) => {
    return new Promise(resolve => {
      database.transaction(tx => {
        tx.executeSql(
          `INSERT INTO contacts (name, identifier, identityKey, deviceId, registrationId) VALUES (?, ?, ?, ?, ?)`,
          [username, identifier, identity, deviceId, registrationId],
          (tx, results) => {
            updateDatabaseState()
            resolve(results.insertId)
          },
        )
      })
    })
  }

  const getConversations = () => {
    return new Promise(resolve => {
      database.transaction(tx => {
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

  const createConversation = contactId => {
    return new Promise(resolve => {
      database.transaction(tx => {
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

  return {
    database,
    createDatabase,
    getContacts,
    createContact,
    getConversations,
    createConversation,
  }
}
