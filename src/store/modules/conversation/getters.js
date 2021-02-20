export default {
  getConversation: state => id => {
    return state.conversations.find(item => parseInt(item.id) === parseInt(id))
  },
  getByReceiverId: state => id => {
    return state.conversations.find(
      item => parseInt(item.receiver.id) === parseInt(id),
    )
  },
  currentConversation: state => {
    return state.conversations.find(
      item => parseInt(item.id) === parseInt(state.currentConversationId),
    )
  },
}
