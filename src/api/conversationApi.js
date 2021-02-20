import { http } from '@/plugins/http'

const prefix = '/conversations'

export default {
  getLastConversations() {
    return http.get(`${prefix}`)
  },
  getConversation(receiverId) {
    return http.get(`${prefix}/${receiverId}`)
  },
  getReceiverLastOnline(receiverId) {
    return http.get(`${prefix}/${receiverId}/last-online`)
  },
  getMessages(conversationId, params = null) {
    return http.get(`${prefix}/${conversationId}/messages`, {
      params,
    })
  },
  addMessage(payload) {
    return http.post(`${prefix}`, payload)
  },
  markReadConversation(conversationId) {
    return http.patch(`${prefix}/${conversationId}/read`)
  },
  deleteMessage(messageId) {
    return http.delete(`${prefix}/${messageId}`)
  },
  deleteConversation(conversationId) {
    return http.delete(`${prefix}/${conversationId}/all`)
  },
}
