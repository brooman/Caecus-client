import Config from '../config/'

const getContact = body => {
  return new Promise(resolve => {
    fetch(`${Config.host.http}/connect/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(res => res.json())
      .then(json => {
        resolve(json)
      })
  })
}

const getPreKeyBundle = body => {
  return new Promise(resolve => {
    fetch(`${Config.host.http}/connect/prekeybundle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(res => res.json())
      .then(json => {
        resolve(json)
      })
  })
}

const sendMessage = body => {
  return new Promise(resolve => {})
}

const recieveMessages = body => {
  return new Promise(resolve => {
    fetch(`${Config.host.http}/messages/recieve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: user,
    })
      .then(res => res.json())
      .then(json => {
        resolve(json)
      })
  })
}

const register = body => {
  return new Promise(resolve => {
    fetch(`${Config.host.http}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(res => res.json())
      .then(json => {
        resolve(json)
      })
  })
}

const login = body => {}

export { getContact, getPreKeyBundle, sendMessage, recieveMessages, register, login }
