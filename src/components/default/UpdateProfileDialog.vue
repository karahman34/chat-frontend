<template>
  <the-dialog :value="value" @change="hideDialog">
    <!-- The Card -->
    <div class="bg-white rounded shadow-lg py-1 w-full max-w-lg">
      <!-- Header -->
      <div class="py-2 px-4 mb-3 border-b text-xl font-semibold">
        <i class="mdi mdi-account mr-1"></i>
        <span>Profile</span>
      </div>

      <!-- Content -->
      <div class="px-4">
        <!-- The Form -->
        <form @submit.prevent="updateProfile">
          <!-- Username -->
          <div class="mb-2">
            <label for="username">Username</label>
            <custom-input
              class="mt-1"
              placeholder="Username"
              :error="errorsField.username !== null"
              v-model="form.username"
            ></custom-input>
            <text-error v-if="errorsField.username">{{
              errorsField.username
            }}</text-error>
          </div>

          <!-- Preview Avatar -->
          <img
            v-if="previewAvatar"
            :src="previewAvatar"
            class="block object-cover w-full mt-3 mb-2"
          />

          <!-- Avatar -->
          <div class="flex flex-col space-y-1">
            <label for="avatar">Avatar</label>
            <input
              ref="avatarInput"
              type="file"
              id="avatar"
              accept="image/*"
              @change="avatarChanged"
            />
            <text-error v-if="errorsField.avatar">{{
              errorsField.avatar
            }}</text-error>
          </div>

          <!-- Submit Button -->
          <submit-button :loading="loading">Update Profile</submit-button>
        </form>
      </div>
    </div>
  </the-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import {
  hideValidationErrors,
  showValidationErrors,
} from '@/helpers/validationForm'
import Dialog from '@/components/default/Dialog'
import CustomInput from '@/components/default/Form/Input'
import SubmitButton from '@/components/default/Form/SubmitButton'
import TextError from '@/components/default/Form/TextError'

export default {
  components: {
    'the-dialog': Dialog,
    CustomInput,
    SubmitButton,
    TextError,
  },

  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    user: {
      type: Object,
      required: true,
    },
    value: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      form: {
        avatar: null,
        username: null,
      },
      errorsField: {
        avatar: null,
        username: null,
      },
      previewAvatar: null,
      loading: false,
    }
  },

  mounted() {
    this.syncProp()
  },

  methods: {
    ...mapActions('auth', {
      updateProfileAction: 'updateProfile',
    }),
    async updateProfile() {
      this.loading = true
      hideValidationErrors(this.errorsField)

      const { username, avatar } = this.form
      const formData = new FormData()
      formData.append('_method', 'PATCH')
      if (avatar !== null) formData.append('avatar', avatar)
      if (username !== null) formData.append('username', username)

      try {
        await this.updateProfileAction(formData)

        this.$toasted.show('Profile updated.', {
          icon: 'mdi-check-circle',
          type: 'success',
        })
      } catch (err) {
        const errCode = err?.response?.status

        if (errCode === 422) {
          showValidationErrors(err.response.data.data, this.errorsField)
        } else {
          this.$toasted.show(
            err?.response?.data?.message || 'Failed to update user profile.',
            {
              icon: 'mdi-close-circle',
              type: 'error',
            },
          )
        }
      } finally {
        this.loading = false
      }
    },
    hideDialog() {
      this.$emit('change', false)
    },
    syncProp() {
      if (!this.user) return

      if (!this.user.avatar.includes('default')) {
        this.previewAvatar = this.user.avatar
      }

      this.form.username = this.user.username
    },
    avatarChanged(e) {
      const file = e.target.files[0]

      if (file) {
        this.form.avatar = file
        this.previewAvatar = URL.createObjectURL(file)
      }

      this.$refs.avatarInput.value = ''
    },
  },
}
</script>
