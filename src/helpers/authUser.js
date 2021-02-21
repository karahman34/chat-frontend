function userStatus(lastOnline, now = null) {
  if (now === null) {
    now = new Date()
  }

  const lastOnlineDate = new Date(lastOnline)

  lastOnlineDate.setMinutes(lastOnlineDate.getMinutes() + 1)

  return lastOnlineDate > now ? 'Online' : 'Offline'
}

export { userStatus }
