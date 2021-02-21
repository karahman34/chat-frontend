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

    <div class="flex items-center space-x-2 w-full">
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
      <input
        type="text"
        class="border border-gray-300 px-3 h-9 rounded-3xl transition-all outline-none w-full focus:border-gray-400 disabled:bg-gray-200 disabled:border-0 disabled:text-gray-500"
        placeholder="Text"
        :disabled="loading"
        v-model="form.message"
      />

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
