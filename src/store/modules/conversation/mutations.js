export default {
  SET_CONVERSATIONS(state, conversations) {
    state.conversations = conversations
  },
  SET_CONVERSATION_MESSAGES(state, { conversation, messages }) {
    const target = state.conversations.find(
      item => parseInt(item.id) === parseInt(conversation.id),
    )

    if (target.messages === null) {
      target.messages = []
    }

    target.messages = [...target.messages, ...messages]
  },
  SET_PAGE(state, { conversation, page, lastPage }) {
    const target = state.conversations.find(
      item => parseInt(item.id) === parseInt(conversation.id),
    )

    target.page = page
    target.lastPage = lastPage
  },
  SET_LAST_CONVERSATION_MESSAGES(state, { conversation, message }) {
    const target = state.conversations.find(
      item => parseInt(item.id) === parseInt(conversation.id),
    )

    target.last_message = message
  },
  ADD_CONVERSATION(state, conversation) {
    state.conversations.push(conversation)
  },
  ADD_CONVERSATION_MESSAGE(state, { conversation, message }) {
    const target = state.conversations.find(
      item => parseInt(item.id) === parseInt(conversation.id),
    )

    target.messages === null
      ? (target.messages = [message])
      : target.messages.unshift(message)
  },
  SET_UNREAD_MESSAGES(state, { conversation, val }) {
    const target = state.conversations.find(
      item => parseInt(item.id) === parseInt(conversation.id),
    )

    target.unread_messages = parseInt(val)
  },
  INCREMENT_UNREAD_MESSAGES(state, conversation) {
    const target = state.conversations.find(
      item => parseInt(item.id) === parseInt(conversation.id),
    )

    target.unread_messages = parseInt(target.unread_messages) + 1
  },
  SET_CURRENT_CONVERSATION_ID(state, currentConversationId) {
    state.currentConversationId = currentConversationId
  },
  DELETE_CONVERSATION_MESSAGE(state, { conversation, messageId }) {
    const target = state.conversations.find(
      item => parseInt(item.id) === parseInt(conversation.id),
    )

    target.messages.splice(
      target.messages.findIndex(
        item => parseInt(item.id) === parseInt(messageId),
      ),
      1,
    )
  },
  DELETE_CONVERSATION_MESSAGES(state, conversation) {
    const target = state.conversations.find(
      item => parseInt(item.id) === parseInt(conversation.id),
    )

    target.messages = []
    target.last_message = null
  },
  UPDATE_RECEIVER_LAST_ONLINE(state, { receiverId, lastOnline }) {
    const target = state.conversations.find(
      conversation =>
        parseInt(conversation.receiver.id) === parseInt(receiverId),
    )

    target.receiver.last_online = lastOnline
  },
  CLEAR_STATES(state) {
    state.conversations = []
    state.currentConversationId = null
  },
}
