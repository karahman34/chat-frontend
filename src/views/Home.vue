<template>
  <div id="home-page" class="w-full h-full relative">
    <!-- Loading -->
    <div
      v-if="getConversationLoading"
      class="h-full flex flex-col space-y-3 justify-center items-center text-gray-500"
    >
      <i class="mdi mdi-loading mdi-spin text-5xl"></i>
      <span class="text-2xl">Getting conversations..</span>
    </div>

    <!-- Chat Container -->
    <div
      v-if="messages !== null"
      id="chat-container"
      ref="chatContainer"
      class="relative h-full flex flex-col space-y-2 py-3 bg-gray-100 overflow-y-auto"
    >
      <!-- Infinite Scroll -->
      <infinite-loading
        v-if="currentConversation.page && !isInLastPage() && !firstLoad"
        :identifier="infiniteId"
        direction="top"
        spinner="waveDots"
        @infinite="getConversationMessages"
      >
        <div slot="no-more"></div>
      </infinite-loading>

      <!-- List of messages -->
      <message-card
        v-for="message in messages"
        :key="message.id"
        :conversation="currentConversation"
        :message="message"
        :init-show-utilities="
          lastMessage && lastMessage.id === message.id && firstLoad
        "
      ></message-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import InfiniteLoading from 'vue-infinite-loading'
import MessageCard from '@/components/default/MessageCard'

export default {
  name: 'Home',

  components: {
    MessageCard,
    InfiniteLoading,
  },

  data() {
    return {
      prevReceiverId: null,
      getConversationLoading: false,
      infiniteId: +new Date(),
      infiniteLoading: false,
      firstLoad: false,
    }
  },

  computed: {
    ...mapGetters('conversation', {
      currentConversation: 'currentConversation',
    }),
    messages() {
      if (this.currentConversation.messages === null) {
        return null
      }

      return [...this.currentConversation.messages].reverse()
    },
    lastMessage() {
      return !Array.isArray(this.messages)
        ? null
        : this.messages[this.messages.length - 1]
    },
  },

  watch: {
    currentConversation: {
      immediate: true,
      handler(val, old) {
        if (old) {
          this.prevReceiverId = old.receiver.id
          this.toggleReceiverEvent(true)
        }

        this.infiniteId += 1
        this.firstLoad = true
        this.markReadMessages()
        this.toggleReceiverEvent()
      },
    },
    messages: {
      immediate: true,
      handler(val, old) {
        if (val === null) {
          this.getConversationMessages()
          return
        }

        const valArray = Array.isArray(val)
        const oldArray = Array.isArray(old)

        if (
          this.firstLoad ||
          (valArray && !old) ||
          (valArray && oldArray && val.length > old.length)
        ) {
          this.$nextTick(() => {
            this.updateScroll()
            this.firstLoad = false
          })
        }
      },
    },
  },

  methods: {
    ...mapMutations('conversation', {
      updateReceiverProfile: 'UPDATE_RECEIVER_PROFILE',
      updateReceiverLastOnline: 'UPDATE_RECEIVER_LAST_ONLINE',
    }),
    ...mapActions('conversation', {
      markReadAction: 'markRead',
      getConversationMessagesAction: 'getConversationMessages',
    }),
    isInLastPage() {
      const { page, lastPage } = this.currentConversation

      return page === lastPage
    },
    finishInfinite($state) {
      $state.loaded()

      if (this.isInLastPage()) {
        $state.complete()
      }
    },
    async getConversationMessages($state = null) {
      if (this.getConversationLoading) $state.loaded()
      if ($state !== null) this.infiniteLoading = true
      if ($state === null) this.getConversationLoading = true

      const params = {}
      if (this.currentConversation.page)
        params.page = parseInt(this.currentConversation.page) + 1

      try {
        await this.getConversationMessagesAction({
          conversation: this.currentConversation,
          params,
        })

        if ($state !== null) {
          this.finishInfinite($state)
        }
      } catch (err) {
        this.$toasted.show('Failed to load conversations data.', {
          icon: 'mdi-close-circle',
          type: 'error',
        })
      } finally {
        this.infiniteLoading = false
        this.getConversationLoading = false
      }
    },
    updateReceiverLastOnlineHandler(event) {
      const { user } = event

      this.updateReceiverLastOnline({
        receiverId: user.id,
        lastOnline: user.last_online,
      })
    },
    updateReceiverProfileHandler(event) {
      this.updateReceiverProfile(event.user)
    },
    toggleReceiverEvent(stop = false) {
      if (stop) {
        window.Echo.leave(`conversation.to.${this.prevReceiverId}`)
      } else {
        window.Echo.private(
          `conversation.to.${this.currentConversation.receiver.id}`,
        )
          .listen('.profile.updated', this.updateReceiverProfileHandler)
          .listen('.last_online.updated', this.updateReceiverLastOnlineHandler)
      }
    },
    updateScroll() {
      const chatContainer = this.$refs.chatContainer

      if (!this.infiniteLoading) {
        chatContainer.scrollTop = chatContainer.scrollHeight
      }
    },
    markReadMessages() {
      if (parseInt(this.currentConversation.unread_messages) > 0) {
        this.markReadAction(this.currentConversation)
      }
    },
  },

  beforeDestroy() {
    this.toggleReceiverEvent(true)
  },
}
</script>
