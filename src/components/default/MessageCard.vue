<template>
  <div
    class="message px-4 flex space-y-1 w-full"
    :class="[
      {
        'justify-end': senderIsMe,
      },
    ]"
  >
    <!-- Message Item Container -->
    <div
      class="message-item-container"
      :class="{
        sender: senderIsMe,
      }"
    >
      <!-- Menu -->
      <message-menu-dropdown
        :sender-is-me="senderIsMe"
        :loading-delete="deleteLoading"
        @delete="deleteMessage"
      ></message-menu-dropdown>

      <!-- Card -->
      <div
        class="message-card py-1 px-1 shadow rounded-lg w-max flex flex-col overflow-hidden"
        :class="[
          {
            'bg-gray-800 text-white': !senderIsMe,
            'bg-white items-end': senderIsMe,
          },
        ]"
        :title="createdTime"
      >
        <!-- Image -->
        <message-image
          v-if="message.file"
          :class="{
            'mb-1': message.message,
          }"
          :image="message.file"
        ></message-image>

        <!-- Text & Date -->
        <div class="text-right px-2 flex justify-between space-x-2">
          <!-- Text -->
          <div v-if="message.message" class="whitespace-pre-line">
            {{ message.message }}
          </div>

          <!-- Created Time -->
          <span
            class="created-time inline-flex items-center space-x-1 text-sm"
            :class="{
              'text-gray-500': senderIsMe && message.message,
              'text-gray-200': !senderIsMe && message.message,
              'side-bottom mt-auto': message.message,
              'absolute right-4 bottom-2 text-gray-50':
                message.file && !message.message,
            }"
          >
            <i class="mdi mdi-clock"></i>
            <span>{{ createdTime }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import moment from 'moment'
import MessageImage from '@/components/default/MessageImage'
import MessageMenuDropdown from '@/components/default/MessageMenuDropdown'

export default {
  components: {
    MessageImage,
    MessageMenuDropdown,
  },

  props: {
    conversation: {
      type: Object,
      required: true,
    },
    message: {
      type: Object,
      required: true,
    },
    initShowUtilities: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      deleteLoading: false,
      createdTime: null,
    }
  },

  computed: {
    senderIsMe() {
      return this.message.sender === 'me'
    },
  },

  created() {
    this.setCreatedTime()
  },

  mounted() {
    setInterval(() => this.setCreatedTime(), 1000 * 60)
  },

  methods: {
    ...mapActions('conversation', {
      deleteMessageAction: 'deleteMessage',
    }),
    async deleteMessage() {
      if (this.deleteLoading) return
      this.deleteLoading = true

      try {
        await this.deleteMessageAction({
          conversation: this.conversation,
          messageId: this.message.id,
        })

        this.$toasted.show('Message Deleted.', {
          icon: 'mdi-check-circle',
          type: 'success',
        })
      } catch (err) {
        this.$toasted.show(
          err?.response?.data?.message || 'Failed to delete message.',
          {
            icon: 'mdi-close-circle',
            type: 'error',
          },
        )
      } finally {
        this.deleteLoading = false
      }
    },
    setCreatedTime() {
      this.createdTime = moment(this.message.created_at).from()
    },
  },
}
</script>

<style lang="scss" scoped>
.message {
  .message-item-container {
    position: relative;
    width: max-content;
    max-width: 85%;
    display: flex;
    align-items: center;
    flex-direction: row-reverse;

    .message-menu-dropdown {
      margin-left: 0.75rem;
    }

    &.sender {
      flex-direction: row;
      justify-content: flex-end;

      .message-menu-dropdown {
        margin-left: 0;
        margin-right: 0.75rem;
      }
    }

    &:hover {
      .message-menu-dropdown {
        opacity: 1;
      }
    }
  }

  .created-time {
    &.side-bottom {
      position: relative;
      bottom: -1px;
    }
  }
}
</style>
