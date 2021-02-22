<template>
  <div
    class="people cursor-pointer py-3 border-b border-gray-300 flex"
    @click="peopleClickHandler"
  >
    <img :src="people.avatar" class="user-avatar" />

    <div class="flex flex-col justify-center">
      <div class="flex items-center space-x-3">
        <span>{{ people.username }}</span>
        <i
          v-if="getConversationLoading"
          class="mdi mdi-loading mdi-spin leading-4"
        ></i>
      </div>
      <span
        class="online-indicator"
        :class="{ offline: userStatus === 'Offline' }"
        >{{ userStatus }}</span
      >
    </div>
  </div>
</template>

<script>
import { userStatus } from '@/helpers/authUser'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  props: {
    people: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      getConversationLoading: false,
    }
  },

  computed: {
    ...mapGetters('conversation', {
      getCurrentConversation: 'getByReceiverId',
    }),
    userStatus() {
      return userStatus(this.people.last_online)
    },
  },

  methods: {
    ...mapMutations('conversation', {
      setCurrentConversationId: 'SET_CURRENT_CONVERSATION_ID',
    }),
    ...mapActions('conversation', {
      getConversationAction: 'getConversation',
    }),
    peopleClickHandler() {
      const conversation = this.getCurrentConversation(this.people.id)

      conversation
        ? this.setCurrentConversationId(conversation.id)
        : this.getConversation()
    },
    async getConversation() {
      if (this.getConversationLoading) return
      this.getConversationLoading = true

      try {
        const res = await this.getConversationAction(this.people.id)

        this.setCurrentConversationId(res.data.data.id)
      } catch (err) {
        this.$toasted.show(
          err?.response?.data?.message || 'Failed to get conversation.',
          {
            icon: 'mdi-close-circle',
            type: 'error',
          },
        )
      } finally {
        this.getConversationLoading = false
      }
    },
  },
}
</script>
