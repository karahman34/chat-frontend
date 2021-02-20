import conversationApi from '@/api/conversationApi'

export default {
  getLastConversations({ commit }) {
    return new Promise((resolve, reject) => {
      conversationApi
        .getLastConversations()
        .then(res => {
          commit('SET_CONVERSATIONS', res.data.data)

          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  getConversation({ state, commit }, receiverId) {
    return new Promise((resolve, reject) => {
      conversationApi
        .getConversation(receiverId)
        .then(res => {
          const conversation = res.data.data
          const conversationExist = state.conversations.findIndex(
            item => parseInt(item.id) === conversation.id,
          )
          if (conversationExist < 0) {
            commit('ADD_CONVERSATION', conversation)
          }

          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  getConversationMessages({ commit }, { conversation, params }) {
    return new Promise((resolve, reject) => {
      conversationApi
        .getMessages(conversation.id, params)
        .then(res => {
          const meta = res.data.meta
          const messages = res.data.data

          commit('SET_PAGE', {
            conversation,
            page: meta.current_page,
            lastPage: meta.last_page,
          })

          commit('SET_CONVERSATION_MESSAGES', {
            conversation,
            messages,
          })

          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  getReceiverLastOnline({ commit }, receiverId) {
    return new Promise((resolve, reject) => {
      conversationApi
        .getReceiverLastOnline(receiverId)
        .then(res => {
          commit('UPDATE_RECEIVER_LAST_ONLINE', {
            receiverId,
            lastOnline: res.data.data,
          })

          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  createMessage({ commit }, { conversation, payload }) {
    return new Promise((resolve, reject) => {
      conversationApi
        .addMessage(payload)
        .then(res => {
          commit('ADD_CONVERSATION_MESSAGE', {
            conversation,
            message: res.data.data,
          })

          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  markRead({ commit }, conversation) {
    return new Promise((resolve, reject) => {
      conversationApi
        .markReadConversation(conversation.id)
        .then(res => {
          commit('SET_UNREAD_MESSAGES', {
            conversation,
            val: 0,
          })

          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  deleteMessage({ getters, commit }, { conversation, messageId }) {
    return new Promise((resolve, reject) => {
      conversationApi
        .deleteMessage(messageId)
        .then(res => {
          const conversationState = getters.getConversation(conversation.id)

          conversationState.messages.length === 1
            ? commit('DELETE_CONVERSATION_MESSAGES', conversation)
            : commit('DELETE_CONVERSATION_MESSAGE', { conversation, messageId })

          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  deleteConversation({ commit }, conversation) {
    return new Promise((resolve, reject) => {
      conversationApi
        .deleteConversation(conversation.id)
        .then(res => {
          commit('DELETE_CONVERSATION_MESSAGES', conversation)

          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
}
