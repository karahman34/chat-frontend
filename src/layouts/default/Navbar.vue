<template>
  <header
    id="navbar"
    class="px-4 py-3 w-full border-b flex justify-between items-center"
  >
    <!-- Left Side -->
    <div class="flex items-center">
      <i
        class="mdi mdi-arrow-left text-2xl mr-2 cursor-pointer md:hidden"
        @click="$emit('hide')"
      ></i>

      <img :src="conversation.receiver.avatar" class="user-avatar mr-3" />

      <div class="flex flex-col">
        <span>{{ conversation.receiver.username }}</span>
        <span
          v-if="!getReceiverLastOnlineLoading"
          class="online-indicator"
          :class="{ offline: userStatus === 'Offline' }"
          >{{ userStatus }}</span
        >
        <div v-else class="user-status-loading ml-1">
          <div></div>
          <div class="mx-1"></div>
          <div></div>
        </div>
      </div>
    </div>

    <!-- Right Side -->
    <div class="flex items-center space-x-3">
      <i
        v-if="deleteConversationLoading"
        class="mdi mdi-loading mdi-spin text-lg"
      ></i>

      <dropdown-menu>
        <dropdown-item @click="deleteConversation">
          <i
            class="mdi mr-1"
            :class="[
              deleteConversationLoading
                ? 'mdi-loading mdi-spin'
                : 'mdi-trash-can',
            ]"
          ></i>
          <span>Delete Conversation</span>
        </dropdown-item>
      </dropdown-menu>
    </div>
  </header>
</template>

<script>
import { mapActions } from 'vuex'
import { userStatus } from '@/helpers/authUser'
import DropdownMenu from '@/layouts/default/partials/DropdownMenu'
import DropdownItem from '@/layouts/default/partials/DropdownItem'

export default {
  components: {
    DropdownMenu,
    DropdownItem,
  },

  props: {
    conversation: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      dateNow: new Date(),
      deleteConversationLoading: false,
      getReceiverLastOnlineLoading: false,
    }
  },

  computed: {
    userStatus() {
      return userStatus(this.conversation.receiver.last_online, this.dateNow)
    },
  },

  mounted() {
    setInterval(() => (this.dateNow = new Date()), 1000 * 60)
  },

  watch: {
    'conversation.receiver.id': {
      immediate: true,
      handler() {
        this.getReceiverLastOnline()
      },
    },
  },

  methods: {
    ...mapActions('conversation', {
      getReceiverLastOnlineAction: 'getReceiverLastOnline',
      deleteConversationAction: 'deleteConversation',
    }),
    deleteConversation() {
      if (this.deleteConversationLoading) return
      this.deleteConversationLoading = true

      this.deleteConversationAction(this.conversation)
        .catch(err =>
          this.$toasted.show(
            err?.response?.data?.message || 'Failed to delete conversation.',
            {
              icon: 'mdi-close-circle',
              type: 'error',
            },
          ),
        )
        .finally(() => (this.deleteConversationLoading = false))
    },
    getReceiverLastOnline() {
      this.getReceiverLastOnlineLoading = true

      this.getReceiverLastOnlineAction(this.conversation.receiver.id)
        .catch(err =>
          this.$toasted.show(
            err?.response?.data?.message ||
              'Failed to get receiver last online.',
            {
              icon: 'mdi-close-circle',
              type: 'error',
            },
          ),
        )
        .finally(() => (this.getReceiverLastOnlineLoading = false))
    },
  },
}
</script>

<style lang="scss" scoped>
@keyframes user-status-loading {
  0% {
    top: 0;
  }

  50% {
    top: -2.5px;
  }

  100% {
    top: 0;
  }
}

.user-status-loading {
  div {
    display: inline-block;
    position: relative;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: rgb(150, 150, 150);
    animation: user-status-loading 580ms infinite;
  }

  div:nth-child(2) {
    animation-delay: 145ms;
  }

  div:nth-child(3) {
    animation-delay: 290ms;
  }
}
</style>
