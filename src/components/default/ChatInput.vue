<template>
  <form
    id="form-chat"
    class="border-t border-gray-200 flex flex-col justify-center space-y-1 w-full py-2 px-3 bg-white"
    @submit.prevent="createMessage"
  >
    <!-- File Preview -->
    <div
      v-if="form.file"
      class="flex justify-between items-center text-gray-500"
    >
      <!-- File Name -->
      <div class="w-full">
        <span class="font-semibold">{{ form.file.name }}</span>
        <span class="ml-2"
          >({{ (form.file.size / (1024 * 1024)).toFixed(2) }}MB)</span
        >
      </div>

      <!-- Remove File -->
      <button
        type="button"
        class="cursor-pointer disabled:cursor-not-allowed focus:outline-none"
        :disabled="loading"
        @click="form.file = null"
      >
        <i class="mdi mdi-close-circle"></i>
      </button>
    </div>

    <!-- Inputs -->
    <div class="w-full flex items-center space-x-2">
      <!-- Input File -->
      <button
        type="button"
        class="cursor-pointer disabled:cursor-not-allowed focus:outline-none"
        :disabled="loading"
        @click="$refs.inputFile.click()"
      >
        <i class="mdi mdi-image text-xl text-gray-600"></i>
      </button>
      <input ref="inputFile" class="hidden" type="file" @change="fileChanged" />

      <!-- Input Text -->
      <div
        class="form-chat-input flex-grow py-2 px-3 flex relative border rounded-3xl bg-gray-200 transition-colors overflow-hidden focus-within:bg-white focus-within:border-gray-400"
      >
        <!-- Placeholder -->
        <div
          v-show="!form.message || !form.message.length"
          class="placeholder z-10 text-gray-400 absolute outline-none"
        >
          Type a message
        </div>

        <!-- Message -->
        <div
          ref="messageInput"
          :contenteditable="loading ? false : true"
          class="message z-30 min-w-full overflow-x-hidden overflow-y-auto focus:outline-none"
          @input="form.message = $event.target.textContent"
          @keydown="keydownHandler"
        ></div>
      </div>

      <!-- Submit -->
      <button
        v-if="!loading"
        type="submit"
        class="cursor-pointer focus:outline-none disabled:cursor-not-allowed"
        :disabled="disabled"
      >
        <i class="mdi mdi-send text-xl text-gray-600"></i>
      </button>

      <!-- Loading -->
      <template v-else>
        <i class="mdi mdi-loading mdi-spin text-gray-600 text-xl"></i>
      </template>
    </div>
  </form>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    conversation: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      form: {
        message: '',
        file: null,
      },
      loading: false,
      shiftPress: false,
      shiftPressOffTimeout: null,
    }
  },

  computed: {
    disabled() {
      return !this.form.message.length && this.form.file === null
    },
  },

  methods: {
    ...mapActions('conversation', {
      createMessageAction: 'createMessage',
    }),
    fileChanged(e) {
      const file = e.target.files[0]
      if (file && !this.loading) {
        this.form.file = file
      }

      this.$refs.inputFile.value = ''
    },
    keydownHandler(e) {
      const key = e.key.toLowerCase()
      const resetShift = () => {
        clearTimeout(this.shiftPressOffTimeout)
        this.shiftPressOffTimeout = setTimeout(
          () => (this.shiftPress = false),
          300,
        )
      }

      if (key === 'shift') {
        this.shiftPress = true
        resetShift()
      } else if (this.shiftPress && key === 'enter') {
        resetShift()
      } else if (!this.shiftPress && key === 'enter') {
        e.preventDefault()

        this.createMessage()
      } else {
        this.shiftPress = false
      }
    },
    async createMessage() {
      if (this.loading) return
      this.loading = true

      const formData = new FormData()
      formData.append('receiver_id', this.conversation.receiver.id)
      if (this.form.file !== null) formData.append('file', this.form.file)
      if (this.form.message.length)
        formData.append('message', this.form.message)

      try {
        await this.createMessageAction({
          conversation: this.conversation,
          payload: formData,
        })

        this.form.file = null
        this.form.message = ''
        this.$refs.messageInput.textContent = ''
      } catch (err) {
        this.$toasted.show(
          err?.response?.data?.message || 'Failed to create the message.',
          {
            icon: 'mdi-close-circle',
            type: 'error',
          },
        )
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.form-chat-input {
  .placeholder {
    user-select: none;
  }

  .message {
    min-height: 25px;
    max-height: 250px;
  }
}
</style>
