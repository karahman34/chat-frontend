<template>
  <div
    class="conversation cursor-pointer py-3 border-b border-gray-300 flex space-x-2 items-center"
    @click="openConversation"
  >
    <!-- Avatar -->
    <img :src="conversation.receiver.avatar" class="avatar" />

    <div class="flex flex-col w-full">
      <div class="flex justify-between items-center">
        <!-- Username -->
        <span>{{ conversation.receiver.username }}</span>

        <!-- Date -->
        <span v-if="messageDate" class="text-gray-500 font-semibold">{{
          messageDate
        }}</span>
      </div>

      <div class="flex justify-between items-center">
        <!-- Last Message -->
        <span
          class="text-gray-500"
          :class="{
            italic:
              lastMessageText === null ||
              (!lastMessageText && lastMessage.file !== null),
          }"
        >
          {{ lastMessageText || 'empty chat.' | message }}
        </span>

        <!-- Unread Messages -->
        <span
          v-if="conversation.unread_messages > 0"
          class="px-2 bg-gray-800 text-white rounded-full w-max text-sm"
          >{{ conversation.unread_messages }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import moment from 'moment'

export default {
  props: {
    conversation: {
      type: Object,
      required: true,
    },
  },

  filters: {
    message: function(value) {
      return value.length >= 150 ? value.slice(0, 40) + '...' : value
    },
  },

  data() {
    return {
      dateNow: new Date(),
    }
  },

  computed: {
    lastMessage() {
      return Array.isArray(this.conversation.messages)
        ? this.conversation.messages[0]
        : this.conversation.last_message
    },
    lastMessageText() {
      if (!this.lastMessage) {
        return null
      }

      return this.lastMessage.file ? 'file upload.' : this.lastMessage.message
    },
    messageDate() {
      if (this.lastMessage) {
        const now = moment(this.dateNow)
        const messageDate = moment(this.lastMessage.created_at)

        if (messageDate.isSame(now, 'd')) {
          return messageDate.fromNow()
        } else if (
          moment()
            .subtract(1, 'days')
            .isSame(messageDate, 'd')
        ) {
          return 'Yesterday'
        } else {
          return messageDate.format('DD/MM/YYYY')
        }
      }

      return null
    },
  },

  mounted() {
    setInterval(() => (this.dateNow = new Date()), 1000)
  },

  methods: {
    ...mapMutations('conversation', {
      setCurrentConversationId: 'SET_CURRENT_CONVERSATION_ID',
    }),
    openConversation() {
      this.setCurrentConversationId(this.conversation.id)
    },
  },
}
</script>
