<template>
  <div
    class="message px-4 flex flex-col space-y-1"
    :class="[
      {
        'items-end': message.sender === 'me',
      },
    ]"
  >
    <!-- Only Image -->
    <div
      v-if="message.message === null && message.file"
      class="shadow-md overflow-hidden cursor-pointer w-10/12 md:w-full md:max-w-sm"
      @click="showUtilities = !showUtilities"
    >
      <message-image v-if="message.file" :image="message.file"></message-image>
    </div>

    <!-- Card Container -->
    <div
      v-else
      class="w-10/12 md:w-full md:max-w-sm flex"
      :class="{
        'justify-end': message.sender === 'me',
      }"
    >
      <!-- The Card -->
      <div
        class="message-card px-3 py-2 shadow rounded-lg w-max cursor-pointer"
        :class="[
          {
            'bg-gray-800 text-white': message.sender !== 'me',
            'bg-white': message.sender === 'me',
          },
        ]"
        @click="showUtilities = !showUtilities"
      >
        <message-image
          v-if="message.file"
          class="mb-1"
          :image="message.file"
        ></message-image>

        <!-- Text -->
        <span>{{ message.message }}</span>
      </div>
    </div>

    <!-- Utilities -->
    <transition name="collapse">
      <div
        v-if="showUtilities"
        class="utilities flex items-center space-x-3 text-gray-600"
      >
        <!-- Delete -->
        <div
          v-if="message.sender === 'me'"
          class="flex items-center space-x-1 hover:underline"
          :class="[deleteLoading ? 'cursor-wait' : 'cursor-pointer']"
          @click="deleteMessage"
        >
          <i
            class="mdi"
            :class="[deleteLoading ? 'mdi-loading mdi-spin' : 'mdi-trash-can']"
          ></i>
          <span>{{ deleteLoading ? 'Deleting' : 'Delete' }}</span>
        </div>

        <!-- Created Time -->
        <div class="flex items-center space-x-1">
          <i class="mdi mdi-clock"></i>
          <span>{{ message.created_at | createdTime }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import moment from 'moment'
import MessageImage from '@/components/default/MessageImage'

export default {
  components: {
    MessageImage,
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

  filters: {
    createdTime: function(value) {
      return moment(value).fromNow()
    },
  },

  data() {
    return {
      deleteLoading: false,
      showUtilities: false,
    }
  },

  mounted() {
    if (this.initShowUtilities) {
      this.showUtilities = true
    }
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
  },
}
</script>

<style lang="scss" scoped>
.collapse-enter-active,
.collapse-leave-active {
  height: 100%;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.collapse-enter-to,
.collapse-leave {
  max-height: 26px;
}

.collapse-enter,
.collapse-leave-to {
  max-height: 0;
}
</style>
