import Config from '../config'

const getContact = (body) => {
  return new Promise((resolve) => {
    fetch(`${Config.host.http}/connect/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((json) => {
        resolve(json)
      })
      .catch((e) => console.log(e))
  })
}

const getPreKeyBundle = (body) => {
  return new Promise((resolve) => {
    fetch(`${Config.host.http}/connect/prekeybundle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((json) => {
        resolve(json)
      })
      .catch((e) => console.log(e))
  })
}

const sendMessage = (body) => {
  return new Promise((resolve) => {
    fetch(`${Config.host.http}/messages/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((json) => {
        resolve(json)
      })
  }).catch((e) => console.log(e))
}

const recieveMessages = (body) => {
  return new Promise((resolve) => {
    fetch(`${Config.host.http}/messages/recieve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((json) => {
        resolve(json)
      })
      .catch((e) => console.log(e))
  })
}

const registerRecieved = (body) => {
  return new Promise((resolve) => {
    fetch(`${Config.host.http}/messages/recieved`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((json) => {
        resolve(json)
      })
      .catch((e) => console.log(e))
  })
}

const register = (body) => {
  return new Promise((resolve) => {
    fetch(`${Config.host.http}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((json) => {
        resolve(json)
      })
      .catch((e) => console.log(e))
  })
}

const login = (body) => {}

export {
  getContact,
  getPreKeyBundle,
  sendMessage,
  recieveMessages,
  registerRecieved,
  register,
  login,
}
