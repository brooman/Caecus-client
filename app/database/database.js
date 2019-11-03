import * as SQLite from 'expo-sqlite'

const database = SQLite.openDatabase('storage.db')

const createDatabase = () => {
  database.transaction(
    tx => {
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS messages (
          id	INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT,
          content	TEXT,
          date TEXT,
          sender_id	INTEGER,
          conversation_id	INTEGER
        );
      `)
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS conversations (
          id	INTEGER PRIMARY KEY AUTOINCREMENT,
          name	TEXT NOT NULL,
          sender_id	INTEGER NOT NULL UNIQUE
        );
      `)
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS senders (
          id	INTEGER PRIMARY KEY AUTOINCREMENT,
          name	TEXT NOT NULL,
          image	BLOB
        );
      `)
    },
    e => {
      console.warn(e)
    },
  )
}

export { database, createDatabase }
